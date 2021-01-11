import * as vscode from "vscode";
import { FabExt } from '../extension';
import { IJsonLoadable } from "../resources";
import { Entity, EntityType, ValueType } from './entities';
import { COD } from './parser';

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

	loadFromJsonObject(data: object): void {
		this.flowTypes = data['KEYWORDS']['FLOWCONTROL'].values as string[];
		this.specialTypes = data['KEYWORDS']['SPECIALTYPES'].values as string[];
		this.valueTypes = data['KEYWORDS']['VALUETYPES'].values as string[];
		Object.keys(data['ENUMS']).forEach(key => {
			this.enumGroups[key.toUpperCase()] = data['ENUMS'][key];
			data['ENUMS'][key].values.forEach(item => {
				this.enumTypes.push(item);
			});
		});
		Object.keys(data['CONSTANTS']).forEach(key => {			
			this.constants[key.toUpperCase()] = data['CONSTANTS'][key];
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

	private findDotSeqStarterEntity(i: number, ents: Array<Entity>): Entity {
		const llock = ents[i].line;
		let starter: Entity|null = null;
		let flag = true;
		while (flag) {
			if (!ents[i] || ents[i]?.line !== llock) {
				flag = false;
			} else if (ents[i].valueType === ValueType.OBJECT || ents[i].valueType === ValueType.VARIABLE) {
				starter = ents[i];
				flag = false;
				i--;
			} else if(ents[i].value === ')') {
				let count = 0;
				do {
					if (ents[i].value === ')') {
						count++;
					} else if (ents[i].value === '(') {
						count--;
					}
					i--;
				} while (count >= 1);
			} else if(ents[i].value === ']') {
				let count = 0;
				do {
					if (ents[i].value === ']') {
						count++;
					} else if (ents[i].value === '[') {
						count--;
					}
					i--;
				} while (count >= 1);
			} else {
				i--;
			}
		}
		return starter;
	}

	getDotSeqTypeName(cod: COD, start: Entity, end: Entity): [string, Property|Function] {
		let prevType: string = '';
		for (let i = start.index; i <= end.index; i++) {
			const curr = cod.entities[i];
			if (!curr.isPrimitive) {
				if (curr.valueType === ValueType.OBJECT) {
					prevType = curr.value.toUpperCase();
				} else if (curr.valueType === ValueType.VARIABLE) {
					const ents = cod.keywords.variables.get(curr.value.toUpperCase());
					const firstSet = ents.find(p => cod.entities[p.index - 1]?.value.toUpperCase() === 'DIM' || cod.entities[p.index - 1]?.value.toUpperCase() === 'OBJECT');
					if (firstSet) {
						for (let i = firstSet.index + 1; i <= firstSet.index + 3; i++) {
							const element = cod.entities[i].value.toUpperCase();
							if (['=', 'AS', 'NEW'].includes(element) === false) {
								const setter = cod.entities[i];
								if (cod.entities[setter.index+1].value !== '.') {
									prevType = cod.entities[i].value.toUpperCase();
								}
								break;
							}
						}
					}
				} else if (curr.entityType === EntityType.INDEXED || curr.entityType === EntityType.PROPERTY) {
					if (prevType && curr.equal(end)) {
						const fact = FabExt.Data.objects[prevType];
						const prop = fact?.properties.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						return prop ? [prevType, prop] : null;
					} else if (prevType) {
						const fact = FabExt.Data.objects[prevType];
						const prop = fact?.properties.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						prevType = prop ? prop.returns[0].toUpperCase() : '';
					} else {
						debugger;
					}
				} else if (curr.entityType === EntityType.METHOD) {
					if (prevType && curr.equal(end)) {
						const fact = FabExt.Data.objects[prevType];
						const meth = fact?.methods.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						return meth ? [prevType, meth] : null;
					} else if (prevType) {
						const fact = FabExt.Data.objects[prevType];
						const meth = fact?.methods.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						prevType = meth ? meth.returns[0].toUpperCase() : '';
					} else {
						debugger;
					}
				}
			} else if (curr.value === '(') {
				let count = 0;
				do {
					if (cod.entities[i].value === '(') {
						count++;
					} else if (cod.entities[i].value === ')') {
						count--;
					}
					i++;
				} while (count >= 1);
				i--; // correction for i++ in for loop
			} else if (curr.value === '[') {
				let count = 0;
				do {
					if (cod.entities[i].value === '[') {
						count++;
					} else if (cod.entities[i].value === ']') {
						count--;
					}
					i++;
				} while (count >= 1);
				i--; // correction for i++ in for loop
			}

		}
		return null;
	}

	getDottedMarkdown(cod: COD, ent: Entity, illuminateIndex?: number): vscode.MarkdownString|null {
		const start = this.findDotSeqStarterEntity(ent.index, cod.entities);
		let result = '';
		if (start) {
			const retn = this.getDotSeqTypeName(cod, start, ent);
			if (retn && retn[1] instanceof Object && retn[1]['args']) {
				const parType = retn[0];
				const meth: Function = retn[1] as Function;
				const methlink = FabExt.Data.objects[parType].link + "#function-" + meth.id.toLowerCase();
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
				const proplink = FabExt.Data.objects[parType].link + "#property-" + prop.id.toLowerCase();
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
}

interface Dictionary<T> {
	[Key: string]: T;
}

interface Info {
	desc?: string;
	args?: Dictionary<string>;
	returns?: string;
	readonly?: boolean;
	remarks?: string;
}

interface Argument {
	id: string;
	types: string[];
	optional: boolean;
	notes: string;
}

interface Function {
	id: string;
	returns: string[];
	args: Argument[];
	info: Info;
}

interface Property {
	id: string;
	returns: string[];
	info: Info;
}

interface Enum {
	id: string;
	values: string[];
	info: Info;
}

interface Artifact {
	id: string;
	constructor?: Function;
	properties: Property[];
	methods: Function[];	
	info: Info;
	link: string;
}
