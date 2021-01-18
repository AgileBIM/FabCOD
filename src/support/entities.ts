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

	// Sequencial Informal Collections
	FUNCTION = 'FUNCTION',			// Any circumstance where a word ends with an attached ( and does not begin with a .
	METHOD = 'METHOD',				// Any circumstance where a word ends with an attached ( and begins with a .
	INDEXED = 'INDEXED',			// Any circumstance where a word ends with an attached [
	DOTTED = 'DOTTED', 				// represents the beginning of a dotted sequence
	PROPERTY = 'PROPERTY',			// Anything in a Dotted sequence that isn't a dot starter, indexed or method type.

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
	DO = 'DO',
	FOR = 'FOR'
}

// It would be interesting if it was possible to add an helpObject pointer (probably index | indices[]) to each symbol as your parsing
export class Entity {
	line: number;
	column: number;
	value: string;	
	entityType: EntityType;
	valueType: ValueType;
	index: number;
	

	getRange(): vscode.Range {		
		return new vscode.Range(this.line, this.column, this.line, this.column + this.value.length);
	}

	constructor(etype: EntityType, vtype: ValueType, val?: string, lin?: number, col?: number, globalPosition?: number) {
		this.valueType = vtype;
		this.entityType = etype ? etype : EntityType.ENTITY; 
		this.line = lin ?? 0;
		this.column = col ?? 0;
		this.value = val ?? '';
		this.index = globalPosition ?? -1;
		}

	get endColumn(): number { return this.isValid ? this.column + this.value.length : -1; }
	get position(): vscode.Position{ return new vscode.Position(this.isValid ? this.line : 0, this.isValid ? this.column: 0); }
	get isPrimitive(): boolean { return this.isComment || this.isString || this.isNumber || this.isBoolean || this.isNull || this.isSymbol; }
	get isBoolean(): boolean { return this.valueType === ValueType.BOOL; }
	get isNull(): boolean { return this.valueType === ValueType.NULL; }
	get isComment(): boolean { return this.valueType === ValueType.COMMENT; }
	get isString(): boolean { return this.valueType === ValueType.STRING; }
	get isNumber(): boolean { return this.valueType === ValueType.NUMBER; }
	get isSymbol(): boolean { return this.valueType === ValueType.SYMBOL; }
	get isValid(): boolean { return this.line !== -1 && this.column !== -1; }

	public getText(_doc: vscode.TextDocument): string {
		return this.value;
	}

	getAtPosition(pos: vscode.Position): Entity|null {
		return this.getRange().contains(pos) ? this : null;
	}

	equal(ent: Entity): boolean {
		return ent && ent.line === this.line && ent.column === this.column && ent.value === this.value;
	}

	contains(pos: vscode.Position): boolean {
		return this.getRange().contains(pos);
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
		let last: Entity|EntityCollection;
		for (let i = this.children.length-1; i >= 0; i--) {
			last = this.children[i];
			if (last) {
				break;
			}
		}
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

	getAtPosition(pos: vscode.Position): Entity|null {
		const found = this.children.find(p => p.getRange().contains(pos));
		if (found instanceof EntityCollection) {
			return found.getAtPosition(pos);
		} else {
			return found ?? null;
		}
	}

	contains(pos: vscode.Position|Entity|EntityCollection) {
		if (!(pos instanceof vscode.Position)) {
			pos = pos.position;
		}
		return this.getRange().contains(pos);
	}

	getParentCollection(source: Entity|EntityCollection, searchIn: Array<Entity|EntityCollection>): Array<Entity|EntityCollection> {
		let result: Array<Entity|EntityCollection>;
		if (source instanceof EntityCollection) {
			for (let i = 0; i < searchIn.length; i++) {
				const ent = searchIn[i];
				if (ent instanceof EntityCollection){
					if (ent.equal(source)) {
						result = searchIn;
					} else if (ent.contains(source.position)) {
						result = ent.getParentCollection(source, ent.children);	
					}
				}	
			}
		} else {
			for (let i = 0; i < searchIn.length; i++) {
				const ent = searchIn[i];
				if (ent instanceof EntityCollection && ent.contains(source.position)) {
					result = ent.getParentCollection(source, ent.children);
					break;
				} else if (ent.equal(source)) {
					result = searchIn;
					break;
				}
			}
		}
		return result;
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
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
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
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return [];
	}
}


export class FunctionDefinitionEntity extends EntityCollection {
	header: EntityCollection;	
	contents: EntityCollection;
	footer: EntityCollection;	
	constructor(starter: EntityCollection, body: EntityCollection, ender: EntityCollection) {
		super(EntityType.FUNCTIONDEF);		
		this.header = starter;
		this.contents = body;
		this.footer = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get name(): Entity { return this.header[1]; }
	get args(): Entity[] { return this.header.children.filter(p => p.valueType !== ValueType.SYMBOL).slice(2); }

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents, this.footer]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return []; 
	}
}

export class InlineIfEntity extends EntityCollection {
	children: Array<Entity>; // Could be an If or Else If	
	constructor(starter: Array<Entity>) {
		super(EntityType.IFINLINE);
		this.children = starter;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get header(): Entity[]|null { 
		const elif = this.children.findIndex(p => p.value.toUpperCase().endsWith('IF'));
		if (elif !== -1) {
			return this.children.slice(0, elif+1);
		} else {
			return null;
		}
	}

	get expression(): Entity[]|null { 
		const elif = this.children.findIndex(p => p.value.toUpperCase().endsWith('IF'));
		const then = this.children.findIndex(p => p.value.toUpperCase() === 'THEN');
		if (then !== -1) {
			return this.children.slice(elif+1, then);
		} else {
			return null;
		}
	}
	get contents(): Entity[]|null { 
		const then = this.children.findIndex(p => p.value.toUpperCase() === 'THEN');
		if (then !== -1) {
			return this.children.slice(then+1);
		} else {
			return null;
		}
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return []; 
	}
}

export class IfEntity extends EntityCollection {
	header: EntityCollection;
	contents: EntityCollection;
	footer: EntityCollection;
	constructor(starter: EntityCollection, body: EntityCollection, ender: EntityCollection) {
		super(EntityType.IF);		
		this.header = starter;
		this.contents = body;
		this.footer = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get expression(): Entity[]|null { 
		const then = this.header.children.findIndex(p => p.value.toUpperCase() === 'THEN');
		if (then !== -1) {
			return this.header.children.slice(1, then);
		} else {
			return null;
		}
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents, this.footer]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return [];
	}
}

export class ElseIfEntity extends EntityCollection {
	header: EntityCollection;
	contents: EntityCollection;
	constructor(starter: EntityCollection, body: EntityCollection) {
		super(EntityType.ELSEIF);
		this.header = starter;
		this.contents = body;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get expression(): Entity[]|null { 
		const elif = this.header.children.findIndex(p => p.value.toUpperCase().endsWith('IF'));
		const then = this.header.children.findIndex(p => p.value.toUpperCase() === 'THEN');
		if (then !== -1) {
			return this.header.children.slice(elif+1, then);
		} else {
			return null;
		}
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return []; 
	}
}


export class ElseEntity extends EntityCollection {
	header: Entity;
	contents: EntityCollection;
	constructor(starter: Entity, body: EntityCollection) {
		super(EntityType.ELSE);
		this.header = starter;
		this.contents = body;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}

export class CaseEntity extends EntityCollection {
	header: EntityCollection;
	contents: EntityCollection;
	constructor(starter: EntityCollection, body: EntityCollection) {
		super(EntityType.CASE);
		this.header = starter;
		this.contents = body;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get expression(): Entity[]|null { 
		if (this.header.children.length >= 2) {
			return this.header.children.slice(1);
		} else {
			return null;
		}
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> {
		return []; 
	}
}

export class SelectEntity extends EntityCollection {
	header: EntityCollection;
	contents: EntityCollection;
	footer: EntityCollection;
	constructor(starter: EntityCollection, body: EntityCollection, ender: EntityCollection) {
		super(EntityType.SELECT);
		this.header = starter;		
		this.contents = body;
		this.footer = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get expression(): Entity[]|null { 
		if (this.header.children.length >= 2) {
			return this.header.children.slice(1);
		} else {
			return null;
		}
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents, this.footer]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}

export class WhileEntity extends EntityCollection {
	header: EntityCollection;
	contents: EntityCollection;
	footer: EntityCollection;
	constructor(starter: EntityCollection, body: EntityCollection, ender: EntityCollection) {
		super(EntityType.WHILE);
		this.header = starter;
		this.contents = body;
		this.footer = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get expression(): Entity[]|null { 
		if (this.header.children.length >= 2) {
			return this.header.children.slice(1);
		} else {
			return null;
		}
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents, this.footer]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}

export class DoEntity extends EntityCollection {
	header: EntityCollection;
	contents: EntityCollection;
	footer: EntityCollection;
	constructor(starter: EntityCollection, body: EntityCollection, ender: EntityCollection) {
		super(EntityType.DO);
		this.header = starter;
		this.contents = body;
		this.footer = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents, this.footer]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}

export class ForNextEntity extends EntityCollection {
	header: EntityCollection;
	contents: EntityCollection;
	footer: EntityCollection;
	
	constructor(starter: EntityCollection, body: EntityCollection, ender: EntityCollection) {
		super(EntityType.DO);
		this.header = starter;
		this.contents = body;
		this.footer = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	get children(): Array<Entity|EntityCollection> { 
		return [this.header, this.contents, this.footer]; 
	}

	warnings(parent?: EntityCollection): Array<vscode.CodeLens> { 
		return []; 
	}
}
