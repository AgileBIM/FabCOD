import * as vscode from "vscode";

export const stdSymbols = ['+', '-', '*', '/', '=', '<', '>', '(', ')', '[', ']', ','];
export const foldStarters = ['IF', 'ELSE', 'ELSEIF', 'FOR', 'WHILE', 'DO', 'SELECT', 'CASE', 'FUNCTION'];   

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

	// SEQUENCE EXTENDED DEFINITION
	// A generic collection of elements that all appear on the same line, but not neccessarily representing the entire line.
	// To be used for test expressions, functions, indexers, dotsequences, etcetera
	// Note: this could even hold a single word because it will also be used as a container for EndIf, End If, End While, EndWhile, etcetera

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

export interface IEntity {
	// Read/Write Properties
	line: number;
	column: number;
	value: string;	
	entityType: EntityType;
	valueType: ValueType;
	index: number;

	// Optional argument that could be available if it is an imported Entity reference
	filePath?: string;
	// Optional Try-Cast available only on Entities derived from EntityCollection 
	group?: IContentCollection;

	// Read-Only Property Getters
	readonly endColumn: number;
	readonly position: vscode.Position;
	readonly isPrimitive: boolean;
	readonly isBoolean: boolean;
	readonly isNull: boolean;
	readonly isComment: boolean;
	readonly isString: boolean;
	readonly isNumber: boolean;
	readonly isSymbol: boolean;
	readonly isValid: boolean;

	// Methods
	getRange(): vscode.Range;
	getText(_doc: vscode.TextDocument): string;
	getAtPosition(pos: vscode.Position): Entity|null;
	equal(ent: Entity): boolean;
	contains(pos: vscode.Position): boolean;
	toString(): string;
}


// It would be interesting if it was possible to add an helpObject pointer (probably index | indices[]) to each symbol as your parsing
export class Entity implements IEntity {
	line: number;
	column: number;
	value: string;	
	entityType: EntityType;
	valueType: ValueType;
	index: number;

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

	getRange(): vscode.Range {		
		return new vscode.Range(this.line, this.column, this.line, this.column + this.value.length);
	}

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



// this will hold the names of all the imported functions
export class ImportedEntity extends Entity {
	filePath: string = '';
	constructor(ent: Entity, path: string) {
		super(ent.entityType, ent.valueType, ent.value, ent.line, ent.column, ent.index);
		this.filePath = path;
		}
}



export interface IContentCollection extends Entity {
	readonly header: Array<IEntity>;
	readonly contents?: Array<IEntity>;
	readonly footer?: Array<IEntity>;
	readonly children: Array<IEntity>;
	readonly group: IContentCollection;
	readonly name?: Entity|undefined;
	readonly args?: Entity[]|undefined;
	
	warnings(parent?: EntityCollection): Array<vscode.CodeLens>;
	firstEntity(): Entity;
	lastEntity(): Entity;
	getRange(): vscode.Range;
	getText(_doc: vscode.TextDocument): string;
	getAtPosition(pos: vscode.Position): Entity|null;
	contains(pos: vscode.Position|Entity|EntityCollection): boolean;
	getParentCollection(source: IEntity, searchIn: Array<IEntity>): Array<IEntity>;
	toString(): string;
}



export class EntityCollection extends Entity implements IEntity, IContentCollection {
	private _header: Array<IEntity>;
	private _contents: Array<IEntity>;
	private _footer: Array<IEntity>;
	private isFunction(): boolean {
		return this.entityType === EntityType.FUNCTIONDEF;
	}

	get header(): Array<IEntity>|undefined { 
		return this._header; 
	}
	get contents(): Array<IEntity>|undefined { 
		return this._contents; 
	}
	get footer(): Array<IEntity>|undefined { 
		return this._footer; 
	}
	get children(): Array<IEntity> {
		if (this.contents && this.footer) {
			return [...this.header].concat(...this.contents).concat(...this.footer);
		} else if (this.contents) {
			return [...this.header].concat(...this.contents);
		} else {
			return [...this.header];
		}
	}
	get group(): IContentCollection { 
		return this; 
	}
	get name(): Entity|undefined { 
		return this.isFunction() ? this.header[1] : undefined; 
	}
	get args(): Entity[]|undefined { 
		return this.isFunction() ? this.header.filter(p => p.valueType !== ValueType.SYMBOL).slice(2) : undefined; 
	}
	
		
	constructor(typ: EntityType, starter: Array<IEntity>, body?: Array<IEntity>, ender?: Array<IEntity>) {
		super(typ, ValueType.COLLECTION);
		this._header = starter;
		this._contents = body;
		this._footer = ender;
		this.value = this.toString();
		const first = this.firstEntity();
		this.line = first ? first.line : -1;
		this.column = first ? first.column : -1;
	}

	warnings(parent?: EntityCollection): vscode.CodeLens[] {
		throw new Error('Method not implemented.');
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

	getText(doc: vscode.TextDocument): string {
		return doc.getText(this.getRange());
	}

	getAtPosition(pos: vscode.Position): Entity|null {
		const found = this.children.find(p => p.getRange().contains(pos));
		if (found instanceof EntityCollection) {
			return found.getAtPosition(pos);
		} else {
			return found ?? null;
		}
	}

	contains(pos: vscode.Position|IEntity) {
		if (!(pos instanceof vscode.Position)) {
			pos = pos.position;
		}
		return this.getRange().contains(pos);
	}

	getParentCollection(source: IEntity, searchIn: Array<IEntity>): Array<IEntity> {
		let result: Array<IEntity>;
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

