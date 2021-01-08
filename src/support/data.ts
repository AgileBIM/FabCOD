import * as vscode from "vscode";
import { IJsonLoadable } from "../resources";

export class DataLibrary implements IJsonLoadable {
	flowTypes: string[] = [];
	specialTypes: string[] = [];
	valueTypes: string[] = [];
	enumTypes: string[] = [];
	enumGroups: Dictionary<string[]> = {};
	constants: Dictionary<Property> = {};
	functions: Dictionary<Function> = {};
	objects: Dictionary<Artifact> = {};
	interfaces: Dictionary<Artifact> = {};

	loadFromJsonObject(data: object): void {
		debugger;
		this.flowTypes = data['KEYWORDS']['FLOWCONTROL'] as string[];
		this.specialTypes = data['KEYWORDS']['SPECIALTYPES'] as string[];
		this.valueTypes = data['KEYWORDS']['VALUETYPES'] as string[];
		Object.keys(data['ENUMS']).forEach(key => {
			this.enumGroups[key.toUpperCase()] = data['ENUMS'][key].values;
			this.enumGroups[key.toUpperCase()].forEach(item => {
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
		debugger;
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
	option: boolean;
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

interface Artifact {
	id: string;
	init?: Function;
	properties: Property[];
	methods: Function[];	
	info: Info;
}
