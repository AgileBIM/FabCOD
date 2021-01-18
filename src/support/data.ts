import * as vscode from "vscode";
import { FabExt } from '../extension';
import { IJsonLoadable, snippets, patterns } from "../resources";
import { Entity, EntityType, ValueType } from './entities';
import { COD, CODutil } from './document';
import { FABRICATION } from "./FabricationDefinition";
import { info } from 'console';

export class DataLibrary implements IJsonLoadable {	
	flowTypes: string[] = [];
	specialTypes: string[] = [];
	valueTypes: string[] = [];
	enumTypes: string[] = [];
	enumGroups: Dictionary<Enum> = {};
	constants: Dictionary<Property> = {};
	functions: Dictionary<Function> = {};
	objects: Dictionary<Artifact> = {};
	interfaces: Dictionary<Artifact> = {};
	private _allCompletionItems: Array<vscode.CompletionItem> = [];

	get snippets(): SnippetLibrary { return snippets; }
	get patterns(): PatternLibrary { return patterns; }

	get AllCompletionItems(): Array<vscode.CompletionItem> {
		if (this._allCompletionItems.length !== 0) {
			return this._allCompletionItems;
		} else {
			FABRICATION.FLOWCONTROL.forEach(item => {
				this._allCompletionItems.push(this.getCompletionItem(item, vscode.CompletionItemKind.Keyword, '1', ''));
			});
			FABRICATION.SPECIALTYPES.forEach(item => {
				this._allCompletionItems.push(this.getCompletionItem(item, vscode.CompletionItemKind.Keyword, '1', ''));
			});
			FABRICATION.VALUETYPES.forEach(item => {
				this._allCompletionItems.push(this.getCompletionItem(item, vscode.CompletionItemKind.Value, '1', ''));
			});
			this.enumTypes.forEach(item => {
				this._allCompletionItems.push(this.getCompletionItem(item, vscode.CompletionItemKind.EnumMember, '1', ''));
			});
			this.snippets.keys.forEach(key => {			
				this._allCompletionItems.push(this.getCompletionItem(key, vscode.CompletionItemKind.Struct, 'Z', this.snippets.data[key].description, this.snippets.data[key].body.join('\r\n')));
			});
			Object.keys(this.functions).forEach(key => {			
				const info = Object.assign({}, this.functions[key].info);
				info.returns = this.functions[key].returns.join('|');
				this._allCompletionItems.push(this.getCompletionItem(this.functions[key].id, vscode.CompletionItemKind.Function, '1', info));
			});
			Object.keys(this.objects).forEach(key => {			
				const info: Info = {};
				if (this.objects[key].constructor) {
					Object.assign(info, this.objects[key].constructor.info);
					info.returns = key;
				} else {
					info.desc = "Static object of type " + key;
					info.readonly = true;
					info.returns = "Static " + key;
				}
				this._allCompletionItems.push(this.getCompletionItem(this.objects[key].id, vscode.CompletionItemKind.Class, '1', info));
			});
			Object.keys(this.constants).forEach(key => {			
				const info = Object.assign({}, this.constants[key].info);
				info.returns = this.constants[key].returns.join('|');
				this._allCompletionItems.push(this.getCompletionItem(this.constants[key].id, vscode.CompletionItemKind.Constant, '1', info));
			});
			return this._allCompletionItems;
		}
	}

	getCompletionItem(id: string, kind: vscode.CompletionItemKind, sort: string, desc: string|Info, snip?: string): vscode.CompletionItem {
		const ci = new vscode.CompletionItem(id, kind);
		ci.sortText = sort;
		if (desc instanceof Object) {
			if (desc.returns) {
				if (desc.readonly) {
					ci.detail = "ReadOnly " + desc.returns;
				} else {
					ci.detail = desc.returns;
				}
			}
			if (desc.desc) {
				ci.documentation = desc.desc;
			}
		}
		else if (desc && desc !== '') {
			ci.documentation = desc;
		}
		if (snip) {
			ci.insertText = new vscode.SnippetString(snip);
			ci.detail = 'Snippet';
		}
		return ci;
	}

	loadFromJsonObject(data: object): void {
		this.flowTypes = data['KEYWORDS']['FLOWCONTROL'].values as string[];
		this.specialTypes = data['KEYWORDS']['SPECIALTYPES'].values as string[];
		this.valueTypes = data['KEYWORDS']['VALUETYPES'].values as string[];
		Object.keys(data['ENUMS']).forEach(key => {
			this.enumGroups[key.toUpperCase()] = data['ENUMS'][key];
			data['ENUMS'][key].values.forEach((item: string) => {
				this.enumTypes.push(item);
			});
		});
		Object.keys(data['CONSTANTS']).forEach(key => {			
			this.constants[key.toUpperCase()] = data['CONSTANTS'][key];
			this.constants[key.toUpperCase()].info.returns = this.constants[key.toUpperCase()].returns.join('|');
		});
		Object.keys(data['FUNCTIONS']).forEach(key => {
			this.functions[key.toUpperCase()] = data['FUNCTIONS'][key];
		});
		Object.keys(data['OBJECTS']).forEach(key => {
			this.objects[key.toUpperCase()] = data['OBJECTS'][key];
		});
		Object.keys(data['INTERFACES']).forEach(key => {
			this.interfaces[key.toUpperCase()] = data['INTERFACES'][key];
		});
	}

	private getMarkdownSignature(name: string, args: Argument[], url: string = '', illuminateIndex?: number): string {
		let result = '';
		if (url !== '' && url.toUpperCase().startsWith("HTTP")) {
			result += '**[' + name + '](' + url + ')**(';
		} else {
			result += '**' + name + '**(';
		}
		args.forEach((arg, i) => {
			result += (arg.optional ? '[' : '');
			result += (i === illuminateIndex) ? '**' : '';
			result +=  arg.id;
			result += (i === illuminateIndex) ? '**' : '';
			result += ' as *';
			result += arg.types.join('|') + '*';
			result += (arg.optional ? ']' : '');
			result += ', ';
		});
		return (args.length >= 1 ? result.slice(0, -2) : result) + ')';
	}

	public getArgumentMarkdown(arg: Argument): vscode.MarkdownString {
		return new vscode.MarkdownString('**' + arg.id + (arg.optional ? '?' : '') + '** as ' + arg.types.join('|') + '\n\n' + arg.notes);
	}


	getDottedMarkdown(cod: COD, ent: Entity, illuminateIndex?: number): vscode.MarkdownString|null {
		const start = CODutil.getSequenceStartEntity(cod, ent.index);
		let result = '';
		if (start) {
			const retn = this.getDotSeqTypeName(cod, start, ent);
			if (retn && retn[1] instanceof Object && retn[1]['args']) {
				const parType = retn[0];
				const meth: Function = retn[1] as Function;
				const objRef = FabExt.Data.objects[parType] ?? FabExt.Data.interfaces[parType];
				const methlink = objRef.link + "#function-" + meth.id.toLowerCase();
				result += this.getMarkdownSignature(meth.id, meth.args, methlink, illuminateIndex) + '\n\n';
				result += 'Returns: *' + meth.returns.join('|') + '*\n\n';
				result += "--- \n\n";
				result += meth.info.desc + '\n\n';
				if (illuminateIndex && illuminateIndex < meth.args.length) {
					const arg = meth.args[illuminateIndex];
					result += "**" + arg.id + ":** " + arg.notes;
				} else {
					result += meth.info.remarks ?? '';
				}
			} else {
				const parType = retn[0];				
				const prop: Property = retn[1] as Property;
				const objRef = FabExt.Data.objects[parType] ?? FabExt.Data.interfaces[parType];
				const proplink = objRef.link + "#property-" + prop.id.toLowerCase();
				result += '**[' + prop.id + ']('+ proplink +')** returns *' + prop.returns.join('|') + '*\n\n';
				result += '--- \n\n';
				result += prop.info.desc + '\n\n';
				result += prop.info.remarks ?? '';
			}

			if (result && result !== '') {
				return new vscode.MarkdownString(result);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	getObjectMarkdown(typeName: string): vscode.MarkdownString|null {
		const upper = typeName.toUpperCase();		
		if (this.objects[upper]) {
			const obj = this.objects[upper];
			let result = '';
			if (obj.constructor) {
				result = 'New ' + this.getMarkdownSignature(obj.id, obj.constructor.args, obj.link) + '\n\n';
				result += '--- \n\n';
				result += obj.constructor.info.desc + '\n\n';
				result += 'Property Count: ' + obj.properties.length + '\n\n';
				result += 'Method Count: ' + obj.methods.length + '\n\n';
				result += obj.constructor.info.remarks ?? '';
			} else {
				result += '**[' + obj.id + '](' + obj.link + ')** as Static *OBJECT*\n\n';
				result += '--- \n\n';
				result += 'Property Count: ' + obj.properties.length + '\n\n';
				result += 'Method Count: ' + obj.methods.length;
			}
			return new vscode.MarkdownString(result);
		} else {
			return null;
		}
	}

	getNamedObjectMarkdown(name: string, illuminateIndex?: number): vscode.MarkdownString|null {
		const upper = name.toUpperCase();
		let result = '';
		if (this.constants[upper]) {
			result += '**' + this.constants[upper].id + '** returns *' + this.constants[upper].returns.join('|') + '*\n\n';
			result += '--- \n\n';
			result += this.constants[upper].info.desc + '\n\n';
			result += this.constants[upper].info.remarks ?? '';
		} else if (this.functions[upper]) {
			result += this.getMarkdownSignature(this.functions[upper].id, this.functions[upper].args, '', illuminateIndex) + '\n\n';
			result += 'Returns: *' + this.functions[upper].returns.join('|') + '*\n\n';
			result += "--- \n\n";
			result += this.functions[upper].info.desc + '\n\n';
			if (illuminateIndex && illuminateIndex < this.functions[upper].args.length) {
				const arg = this.functions[upper].args[illuminateIndex];
				result += "**" + arg.id + ":** " + arg.notes;
			} else {
				result += this.functions[upper].info.remarks ?? '';
			}
		} else if (this.enumTypes.includes(upper)) {			
			let keys = Object.keys(this.enumGroups);
			for (let i = 0; i < keys.length; i++) {	
				let id: string|undefined;			
				const key = keys[i];
				const group = this.enumGroups[key];
				id = group.values.find(p => p.toUpperCase() === upper);
				if (id) {
					result += '**' + key + '** as *ENUM*\n\n';
					result += '--- \n\n';
					group.values.forEach(p => {
						if (p.toUpperCase() === upper) {
							result += '- **' + p + '**\n';
						} else {
							result += '- ' + p + '\n';
						}
					});
					result += '\n';
					result += group.info.desc ?? '';
					result += group.info.remarks ?? '';
					break;
				}
			}
		}
		if (result !== '') {
			return new vscode.MarkdownString(result);
		} else {
			return null;
		}
	}


	getDotSeqTypeName(cod: COD, start: Entity, end: Entity): [string, Property|Function] {
		let prevType: string = '';
		let propfunc: Property|Function;
		for (let i = start.index; i <= end.index; i++) {
			const curr = cod.entities[i];
			if (!curr.isPrimitive) {
				if (prevType === '' && curr.valueType === ValueType.OBJECT) {
					prevType = curr.value.toUpperCase().replace(/\[\]/g, '');
				} else if (curr.valueType === ValueType.VARIABLE) {
					const ents = cod.keywords.variables.get(curr.value.toUpperCase());
					const firstSet = ents.find(p => cod.entities[p.index - 1]?.value.toUpperCase() === 'DIM' || cod.entities[p.index - 1]?.value.toUpperCase() === 'OBJECT');
					if (firstSet) {
						for (let i = firstSet.index + 1; i <= firstSet.index + 3; i++) {
							const element = cod.entities[i].value.toUpperCase();
							if (['=', 'AS', 'NEW'].includes(element) === false) {
								const setter = cod.entities[i];
								if (cod.entities[setter.index+1].value !== '.') {
									prevType = cod.entities[i].value.toUpperCase().replace(/\[\]/g, '');
								}
								break;
							}
						}
					}
				} else if (curr.entityType === EntityType.INDEXED || curr.entityType === EntityType.PROPERTY) {
					if (prevType && curr.equal(end)) {
						const fact = FabExt.Data.objects[prevType] ?? FabExt.Data.interfaces[prevType];
						propfunc = fact?.properties.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						break;
					} else if (prevType) {
						const fact = FabExt.Data.objects[prevType];
						const prop = fact?.properties.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						prevType = prop ? prop.returns[0].toUpperCase().replace(/\[\]/g, '') : '';
					} else {
						debugger;
					}
				} else if (curr.entityType === EntityType.METHOD) {
					if (prevType && curr.equal(end)) {
						const fact = FabExt.Data.objects[prevType];
						propfunc = fact?.methods.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						break;
					} else if (prevType) {
						const fact = FabExt.Data.objects[prevType];
						const meth = fact?.methods.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						prevType = meth ? meth.returns[0].toUpperCase().replace(/\[\]/g, '') : '';
					} else {
						debugger;
					}
				}
			} else if (curr.value === '(') {
				i = CODutil.forwardScanUntil(cod, i, '(', ')');
				i--; // correction for i++ in for loop
			} else if (curr.value === '[') {
				i = CODutil.forwardScanUntil(cod, i, '[', ']');
				i--; // correction for i++ in for loop
			}
	
		}
		return [prevType, propfunc];
	}


}



export interface Dictionary<T> {
	[Key: string]: T;
}

export interface Info {
	desc?: string;
	args?: Dictionary<string>;
	returns?: string;
	readonly?: boolean;
	remarks?: string;
}

export interface Argument {
	id: string;
	types: string[];
	optional: boolean;
	notes: string;
}

export interface Function {
	id: string;
	returns: string[];
	args: Argument[];
	info: Info;
}

export interface Property {
	id: string;
	returns: string[];
	info: Info;
}

export interface Enum {
	id: string;
	values: string[];
	info: Info;
}

export interface Artifact {
	id: string;
	constructor?: Function;
	properties: Property[];
	methods: Function[];	
	info: Info;
	link: string;
}








interface SnippetContent {
	label?: string;
	prefix?: string;
	body: Array<string>;
	description?: string;
}

export class SnippetLibrary implements IJsonLoadable {	
	data: Dictionary<SnippetContent> = {};

	get keys(): string[] { return Object.keys(this.data); }
	get normalKeys(): string[] { return Object.keys(this.data).map(p => p.toUpperCase()); }

	getSnippet(name: string): SnippetContent {
		if (this.data[name]) {
			return this.data[name];
		} else {
			const i = this.normalKeys.indexOf(name.toUpperCase());
			return this.data[this.keys[i]];
		}
	}

	loadFromJsonObject(data: object): void {
		Object.keys(data).forEach(key => {			
			this.data[key] = data[key];
		});
	}
}












interface DimOptionChoice {
	id: string;
	sortId: string;
	dimensions: Array<string>;
	options: Array<string>;
}

export class PatternLibrary implements IJsonLoadable {	
	data: Dictionary<DimOptionChoice> = {};

	get keys(): string[] { return Object.keys(this.data); }

	loadFromJsonObject(data: object): void {
		(data as any).forEach((cid: any) => {
			this.data[cid.id + ''] = cid;
		});
	}
}