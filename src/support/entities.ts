import * as vscode from "vscode";

export const stdSymbols = ['+', '-', '*', '/', '=', '<', '>', '(', ')', '[', ']', ','];
export const blockStarters = ['IF', 'ELSE', 'ELSEIF', 'FOR', 'WHILE', 'DO', 'SELECT', 'CASE', 'FUNCTION'];   

export enum ValueType {
	UNKNOWN = 'UNKNOWN',	// Default value
	ERROR = 'ERROR',		// Parse Error, possibly used to trigger code lens feedback
	
	// Primitives handled by segmentation
	VOID = 'VOID',
	NUMBER = 'NUMBER',
	STRING = 'STRING',
	COMMENT = 'COMMENT',
	SYMBOL = 'SYMBOL',
	BOOL = 'BOOLEAN',
	NULL = 'NULL',
	NOTHING = 'NOTHING',

	// Non-Primitives handled by forumulation
	OBJECT = 'OBJECT',
	KEYWORD = 'KEYWORD',
	CONSTANT = 'CONSTANT',
	COLLECTION = 'COLLECTION',	
	VARIABLE = 'VARIABLE'
	}
	 
export enum EntityType {
	// Primitives
	ENTITY = 'ENTITY',				// Raw sequence of characters, everything ultimately breaks down to Entity. All subsequent types are collections
	CONTENTS = 'CONTENTS', 			// the body of non-sequencial a collection types. IE, a user defined Function, If, Else, Select, Case, etcetera
	SEQUENCE = 'SEQUENCE', 			// Represents a large number of scenarios where a chain of symbols appearing on the same line need to be grouped

	// Sequencial Collections
	FUNCTION = 'FUNCTION',			// Any circumstance where a word ends with an attached (
	INDEXED = 'INDEXED',			// Any circumstance where a word ends with an attached [
	DOTTED = 'DOTTED', 				// represents a sequence of words that have been joined by dots and could contain child INDEXED or FUNCTION collections	
	PROPERTY = 'PROPERTY',

	// Non-Loop Collections
	FUNCTIONDEF = 'FUNCTIONDEF',
	SELECT = 'SELECT',			
	CASE = "CASE",				
	IF = 'IF',					
	IFINLINE = 'IFINLINE',		
	ELSEIF = 'ELSEIF',			
	ELSE = 'ELSE',

	// Loop Collections
	WHILE = 'WHILE',			
	DOWHILE = 'DOWHILE',		
	DOUNTIL = 'DOUNTIL',
	FORNEXT = 'FOR'
}

// It would be interesting if it was possible to add an helpObject pointer (probably index | indices[]) to each symbol as your parsing
export class Entity {
	line: number;
	column: number;
	value: string;	
	entityType: EntityType;
	valueType: ValueType;
	

	getRange(): vscode.Range {		
		return new vscode.Range(this.line, this.column, this.line, this.column + this.value.length);
	}

	constructor(etype: EntityType, vtype: ValueType, val?: string, lin?: number, col?: number) {
		this.valueType = vtype;
		this.entityType = etype ? etype : EntityType.ENTITY; 
		this.line = lin ? lin : 0;
		this.column = col ? col : 0;
		this.value = val ? val : '';
		}

	get endColumn(): number { return this.column + this.value.length; }
	get position(): vscode.Position{ return new vscode.Position(this.line, this.column); }
	get isComment(): boolean { return this.valueType === ValueType.COMMENT; }
	get isString(): boolean { return this.valueType === ValueType.STRING; }
	get isNumber(): boolean { return this.valueType === ValueType.NUMBER; }

	public getText(_doc: vscode.TextDocument): string {
		return this.value;
	}

	toString() { return this.value; }
}

export class EntityImport extends Entity {
	reference: string = '';
	constructor(ent: Entity, path: string) {
		super(ent.entityType, ent.valueType, ent.value, ent.line, ent.column);
		this.reference = path;
		}
}


export abstract class EntityCollection extends Entity {
	abstract children: Array<Entity|EntityCollection>;
	abstract warnings(parent?: EntityCollection): Array<vscode.CodeLens>;
	constructor(type: EntityType) {
		super(type, ValueType.COLLECTION);
	}
	
	firstEntity(): Entity {
		const first = this.children[0];
		if (first instanceof EntityCollection) {
			return first.firstEntity();
		} else {
			return first;
		}
	}

	lastEntity(): Entity {
		const last = this.children[-1];
		if (last instanceof EntityCollection) {
			return last.lastEntity();
		} else {
			return last;
		}
	}

	getRange(): vscode.Range {
		const f = this.firstEntity();
		const l = this.lastEntity();
		return new vscode.Range(f.line, f.column, l.line, l.column + l.value.length);
	}

	getText(_doc: vscode.TextDocument): string {
		return _doc.getText(this.getRange());
	}

	toString() { return this.children.join(' '); }
}



// A generic collection of elements that all appear on the same line, but not neccessarily representing the entire line.
// To be used for test expressions, functions, indexers, dotsequences, etcetera
// Note: this could even hold a single word because it will also be used as a container for EndIf, End If, End While, EndWhile, etcetera
export class SequenceEntity extends EntityCollection {
	children: Array<Entity|EntityCollection>;
	constructor(seqType: EntityType, args: Array<Entity|EntityCollection>) {
		super(seqType);
		this.children = args;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return [];
	}
}


// Specifically used for representing the body of block-type elements
export class ContentsEntity extends EntityCollection {
	children: Array<Entity|EntityCollection>;
	constructor(args: Array<Entity|EntityCollection>) {
		super(EntityType.CONTENTS);
		this.children = args;
		this.value = this.toString();
		this.line = this.firstEntity().line;
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return [];
	}
}


export class FunctionDefinitionEntity extends EntityCollection {
	keyword: Entity;
	name: Entity;
	argSet: EntityCollection;
	contents: EntityCollection;
	endSet: Entity|EntityCollection;	
	constructor(starter: Entity, fname: Entity, inputs: EntityCollection, body: EntityCollection, ender: Entity|EntityCollection) {
		super(EntityType.FUNCTIONDEF);
		this.keyword = starter;
		this.name = fname;
		this.argSet = inputs;
		this.contents = body;
		this.endSet = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.name, this.argSet, this.contents, this.endSet]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return []; 
	}
}

export class InlineIfEntity extends EntityCollection {
	keyword: Entity|EntityCollection; // Could be an If or Else If
	expression: EntityCollection;
	thenEntity: Entity;
	contents: EntityCollection;
	constructor(starter: Entity|EntityCollection, test: EntityCollection, then: Entity, body: EntityCollection) {
		super(EntityType.IFINLINE);
		this.keyword = starter;
		this.expression = test;
		this.thenEntity = then;
		this.contents = body;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.expression, this.thenEntity, this.contents]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		const result: Array<vscode.CodeLens> = [];
		this.children.forEach(ent => {
			if (ent instanceof EntityCollection) {
				result.push(...ent.warnings(this));
			}
		});
		if (!this.thenEntity) {
			result.push(
				new vscode.CodeLens(
					this.children[0].getRange(), 
					{ 
						command: '',
						title: 'All IF statements require a THEN statement' 
					}));
		} else {
			return []; 
		}
	}
}

export class IfEntity extends EntityCollection {
	keyword: Entity;
	expression: EntityCollection;
	thenEntity: Entity;
	contents: EntityCollection;
	endSet: Entity|EntityCollection;
	constructor(starter: Entity, test: EntityCollection, then: Entity, body: EntityCollection, ender: Entity|EntityCollection) {
		super(EntityType.IF);
		this.keyword = starter;
		this.expression = test;
		this.thenEntity = then;
		this.contents = body;
		this.endSet = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.expression, this.thenEntity, this.contents, this.endSet]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		const result: Array<vscode.CodeLens> = [];
		this.children.forEach(ent => {
			if (ent instanceof EntityCollection) {
				result.push(...ent.warnings(this));
			}
		});
		if (!this.thenEntity) {
			result.push(
				new vscode.CodeLens(
					this.children[0].getRange(), 
					{ 
						command: '',
						title: 'All IF statements require a THEN statement' 
					}));
		} else {
			return []; 
		}
	}
}

export class ElseIfEntity extends EntityCollection {
	keyword: Entity|EntityCollection;
	expression: EntityCollection;
	thenEntity: Entity;
	contents: EntityCollection;
	constructor(starter: Entity|EntityCollection, test: EntityCollection, then: Entity, body: EntityCollection) {
		super(EntityType.ELSEIF);
		this.keyword = starter;
		this.expression = test;
		this.thenEntity = then;
		this.contents = body;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.expression, this.thenEntity, this.contents]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		const result: Array<vscode.CodeLens> = [];
		this.children.forEach(ent => {
			if (ent instanceof EntityCollection) {
				result.push(...ent.warnings(this));
			}
		});
		if (!this.thenEntity) {
			result.push(
				new vscode.CodeLens(
					this.children[0].getRange(), 
					{ 
						command: '',
						title: 'All IF statements require a THEN statement' 
					}));
		} else {
			return []; 
		}
	}
}


export class ElseEntity extends EntityCollection {
	keyword: Entity;
	contents: EntityCollection;
	constructor(starter: Entity, body: EntityCollection) {
		super(EntityType.ELSE);
		this.keyword = starter;
		this.contents = body;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.contents]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}

export class CaseEntity extends EntityCollection {
	keyword: Entity;
	expression: EntityCollection;
	contents: EntityCollection;
	constructor(starter: Entity, test: EntityCollection, body: EntityCollection) {
		super(EntityType.CASE);
		this.keyword = starter;
		this.expression = test;
		this.contents = body;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.expression, this.contents]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return []; 
	}
}

export class SelectEntity extends EntityCollection {
	keyword: Entity;
	expression: EntityCollection;
	contents: EntityCollection;
	endSet: Entity|EntityCollection;
	constructor(starter: Entity, test: EntityCollection, body: EntityCollection, ender: Entity|EntityCollection) {
		super(EntityType.SELECT);
		this.keyword = starter;
		this.expression = test;
		this.contents = body;
		this.endSet = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.expression, this.contents, this.endSet]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		const result: Array<vscode.CodeLens> = [];
		this.children.forEach(ent => {
			if (ent.isComment === true) {
				// its okay
			} else if (ent instanceof EntityCollection) {
				if (ent.entityType === EntityType.CASE) {
					result.push(...ent.warnings(this));
				} else { // non-case statement in body of select; would have to be before the first case or a case would have captured it.
					result.push(
						new vscode.CodeLens(
							ent.getRange(), 
							{ 
								command: '',
								title: 'Select statements only support case structures and comments'
							}));
				}
			} else { // random primitive in the body of the select statement, presumably before the first case statement
				result.push(
					new vscode.CodeLens(
						ent.getRange(),
						{
							command: '',
							title: 'Select statements only support case structures and comments'
						}));
			}
		});
		return []; 
	}
}

export class WhileEntity extends EntityCollection {
	keyword: Entity;
	expression: EntityCollection;
	contents: EntityCollection;
	endSet: Entity|EntityCollection;
	constructor(starter: Entity, test: EntityCollection, body: EntityCollection, ender: Entity|EntityCollection) {
		super(EntityType.WHILE);
		this.keyword = starter;
		this.expression = test;
		this.contents = body;
		this.endSet = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.expression, this.contents, this.endSet]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}

export class DoWhileEntity extends EntityCollection {
	keyword: EntityCollection;
	expression: EntityCollection;
	contents: EntityCollection;
	endSet: Entity;
	constructor(starter: EntityCollection, test: EntityCollection, body: EntityCollection, ender: Entity) {
		super(EntityType.DOWHILE);
		this.keyword = starter;
		this.expression = test;
		this.contents = body;
		this.endSet = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.expression, this.contents, this.endSet]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}

export class DoUntilEntity extends EntityCollection {
	keyword: Entity;
	contents: EntityCollection;
	endSet: EntityCollection;
	expression: EntityCollection;
	constructor(starter: Entity, body: EntityCollection, ender: EntityCollection, test: EntityCollection) {
		super(EntityType.DOWHILE);
		this.keyword = starter;		
		this.contents = body;
		this.endSet = ender;
		this.expression = test;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.contents, this.endSet, this.expression]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}

export class ForNextEntity extends EntityCollection {
	keyword: Entity;
	expression: EntityCollection; // this will include variable initializers, the to, its target value and optionally the step sequence
	contents: EntityCollection;
	endSet: EntityCollection; // this will include the Next keyword and whatever variable(s) are being incremented
	
	constructor(starter: Entity, directives: EntityCollection, body: EntityCollection, ender: EntityCollection) {
		super(EntityType.DOWHILE);
		this.keyword = starter;
		this.expression = directives;
		this.contents = body;
		this.endSet = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first.line;
		this.column = first.column;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.keyword, this.expression, this.contents, this.endSet]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}
