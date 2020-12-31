import * as vscode from "vscode";

export enum ValueType {
	UNKNOWN = 'UNKNOWN',			// Default value
	ERROR = 'ERROR',				// This literally is an obvious parse error. Can be used to provide code lens feedback
	VOID = 'VOID',					// Return type
	NUMBER = 'NUMBER',				// Primitive Value Type
	STRING = 'STRING',				// Primitive Value Type
	COMMENT = 'COMMENT',			// Primitive Value Type
	SYMBOL = 'SYMBOL',				// Primitive Value Type
	BOOL = 'BOOLEAN',				// Primitive Value Type
	NULL = 'NULL',					// Primitive Value Type
	NOTHING = 'NOTHING',			// Primitive Value Type
	OBJECT = 'OBJECT',				// Non primitives handled in formulation
	KEYWORD = 'KEYWORD',			// Non primitives handled in formulation
	CONSTANT = 'CONSTANT',			// Non primitives handled in formulation
	COLLECTION = 'COLLECTION',		// Non primitives handled in formulation
	}

export const blockStarters = ['IF', 'ELSE', 'ELSEIF', 'FOR', 'WHILE', 'DO', 'SELECT', 'CASE', 'FUNCTION'];    
export enum EntityType {			// * = Container types that are more often than not multi-line
	ENTITY = 'ENTITY',				// Raw sequence of characters, everything ultimately breaks down to Entity. All subsequent types are collections
	CONTENTS = 'CONTENTS', 			// *the body of a container type. Loop/Function/If/Else/Select/Case, a parenthesis group or even the document itself
	FUNCTIONDEF = 'FUNCTIONDEF',	// *User defined function definition
	FUNCTION = 'FUNCTION',			// Any circumstance where a word ends with an attached ( it would contain the word, the () and its contents
	INDEXED = 'INDEXED',			// Any circumstance where a word ends with an attached [ it would contain the word, the [] and its contents
	IF = 'IF',						// *Contains the IF, its conditional expression, THEN, a ContentsEntityCollection and the ENDIF keywords
	IFINLINE = 'IFINLINE',			// *Similar to the IF, but without the ENDIF keywords
	ELSEIF = 'ELSEIF',				// *Contains the ElseIf keyword(s), its conditional expression, THEN keyword and a ContentsEntityCollection
	ELSE = 'ELSE',					// *Contains the ELSE keyword and a ContentsEntityCollection
	CASE = "CASE",					// *Contains the CASE keyword, its case value *(or ELSE) and a ContentsEntityCollection
	SELECT = 'SELECT',				// *Contains an array of CaseCollections
	LOOP = 'LOOP',					// *Contains one of various starter keywords, its conditional expression, a ContentsEntityCollection & ending keyword(s)	
	SEQUENCE = 'SEQUENCE', 			// has line starting keywords like dim, debug, input and import. Note 1 DIM can define multiple comma seperated variables
	DOTSEQUENCE = 'DOTSEQUENCE' 	// represents a sequence of words that have been joined by dots and could contain child INDEXED or FUNCTION collections
}

export class Entity {
	line: number;
	column: number;
	value: string;
	entityType: EntityType;
	valueType: ValueType;

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
}

export class EntityCollection extends Entity {	
	protected _children: Array<Entity|EntityCollection>;
	public get Children(): Array<Entity|EntityCollection> {return [...this._children]; }
	public set Children(contents: Array<Entity|EntityCollection>) { this._children = contents; }
	constructor(contents: Array<Entity|EntityCollection>, type: EntityType) 
	{
		super(type, ValueType.COLLECTION);
		this._children = contents;
		if (contents[0] instanceof EntityCollection) {
			const pos = contents[0].firstEntity();
			this.line = pos.line;
			this.column = pos.column;
		} else {
			this.line = contents[0].line;
			this.column = contents[0].column;
		}
	}

	firstEntity(): Entity {
		const first = this.Children[0];
		if (first instanceof EntityCollection) {
			return first.firstEntity();
		} else {
			return this;
		}
	}

	lastEntity(): Entity {
		const last = this.Children[-1];
		if (last instanceof EntityCollection) {
			return last.lastEntity();
		} else {
			return this;
		}
	}

	getRange(): vscode.Range {
		const f = this.firstEntity();
		const l = this.lastEntity();
		return new vscode.Range(f.line, f.column, l.line, l.column + l.value.length);
	}

	public getText(_doc: vscode.TextDocument): string {
		return _doc.getText(this.getRange());
	}
}

export class ContentsEntity extends EntityCollection {
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.CONTENTS);
	}
}


export class SequenceEntity extends EntityCollection {	
	get keyword(): Entity {return this._children[0];}
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.SEQUENCE);
	}
}

export class DotSequenceEntity extends EntityCollection {	
	get keyword(): Entity {return this._children[0];}
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.DOTSEQUENCE);
	}
}

export class IndexedEntity extends EntityCollection {	
	get keyword(): Entity {return this._children[0];}
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.INDEXED);
	}
}

export class FunctionEntity extends EntityCollection {	
	get keyword(): Entity {return this._children[0];}
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.FUNCTION);
	}
}

export class FunctionDefinitionEntity extends EntityCollection {
	get keyword(): Entity { return this._children[0]; }
	get name(): Entity { return this._children[1]; }
	get argSet(): Entity|EntityCollection { return this._children[2]; }
	get contents(): Entity|EntityCollection { return this._children[3]; }
	get endSet(): Array<Entity> { return this._children.slice(this._children[-2].value.toUpperCase() === 'END' ? -2 : -1); } 
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.FUNCTIONDEF);
	}
}

export class InlineIfEntity extends EntityCollection {
	get keyword(): Entity { return this._children[0]; }
	get expressions(): Entity|EntityCollection { return this._children[1]; }
	get thenEntity(): Entity { return this._children[2]; }
	get contents(): Entity|EntityCollection { return this._children[3]; }
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.IFINLINE);
	}
}

export class IfEntity extends EntityCollection {
	get keyword(): Entity { return this._children[0]; }
	get expressions(): Entity|EntityCollection { return this._children[1]; }
	get thenEntity(): Entity { return this._children[2]; }
	get contents(): Entity|EntityCollection { return this._children[3]; }
	get endSet(): Array<Entity> { return this._children.slice(this._children[-2].value.toUpperCase() === 'END' ? -2 : -1); } 
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.IF);
	}
	isWellFormed(){
		try {
			return this.keyword.value.toUpperCase() === 'IF' && this.thenEntity.value.toUpperCase() === 'THEN' && this.endSet[0].value.toUpperCase().startsWith('END') && this.endSet[-1].value.toUpperCase().endsWith('IF');	
		} catch (error) { return false; }
	}
}

export class ElseIfEntity extends EntityCollection {
	private offset: number;
	get keyword(): Array<Entity> { return this._children.slice(0, this.offset); } 
	get expressions(): Entity|EntityCollection { return this._children[1 + this.offset]; }
	get thenEntity(): Entity { return this._children[2 + this.offset]; }
	get contents(): Array<Entity|EntityCollection> { return this.getContents(); }
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.ELSEIF);
		this.offset = this._children[0].value.toUpperCase() === 'ELSE' ? 1 : 0;
	}
	isWellFormed(){
		try {
			return this.keyword[0].value.toUpperCase().startsWith('ELSE') && this.keyword[-1].value.toUpperCase().endsWith('IF') && this.thenEntity.value.toUpperCase() === 'THEN';	
		} catch (error) { return false; }
	}
	private getContents(): Array<Entity|EntityCollection> {
		const start = this.firstEntity();
		return this.Children.filter(p => p.line !== start.line);
	}
}

export class ElseEntity extends EntityCollection {
	get keyword(): Entity {return this._children[0];}
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.ELSE);
	}
}

export class CaseEntity extends EntityCollection {
	get keyword(): Entity {return this._children[0];}
	get caseValue(): Entity|EntityCollection {return this._children[1];} // could be ELSE
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.CASE);		
	}
}

export class SelectEntity extends EntityCollection {
	get keyword(): Entity {return this._children[0];}
	get cases(): Array<CaseEntity> {return this._children.filter(p => p instanceof CaseEntity) as CaseEntity[]; }
	get endSet(): Array<Entity> { return this._children.slice(this._children[-2].value.toUpperCase() === 'END' ? -2 : -1); }
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.SELECT);
	}
}

export class LoopEntity extends EntityCollection {
	get keyword(): Entity {return this._children[0];}	
	get expression(): Array<Entity|EntityCollection> { return this.getExpression(); }
	get contents(): Array<Entity|EntityCollection> { return this.getContents(); }
	constructor(args: Array<Entity|EntityCollection>) {
		super(args, EntityType.LOOP);
	}

	private getExpression(): Array<Entity|EntityCollection> {
		const result: Array<Entity|EntityCollection> = [];
		const start = this.firstEntity();
		const next = this.Children[1];
		switch (start.value.toUpperCase()) {
			case 'DO':
				if (next.value.toUpperCase() === 'WHILE'){
					const temp = this.Children.slice(1).filter(p => p.line === start.line);
					result.concat(temp.slice(2));
				} else {
					const last = this.lastEntity();
					const temp = this.Children.slice(1).filter(p => p.line === last.line && p.value.toUpperCase() !== 'UNTIL');
					result.concat(temp.slice(1));	
				}
				break;
			case 'FOR':							
			case 'WHILE':
				const temp = this.Children.slice(1).filter(p => p.line === start.line);
				result.concat(temp.slice(1));
				break;
		}
		return result;
	}

	private getContents(): Array<Entity|EntityCollection> {
		const start = this.firstEntity();
		const next = this.lastEntity();
		return this.Children.filter(p => p.line !== start.line && p.line !== next.line);
	}
}

