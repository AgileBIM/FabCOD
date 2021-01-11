import * as path from 'path';
import * as fs from 'fs';
import { DataLibrary } from "./support/data";

export let library: DataLibrary = new DataLibrary();

export function loadAllResources(){
	readJsonDataFile("./support/FabricationDefinition.json", library);
}	

export interface IJsonLoadable {
	loadFromJsonObject(data: object): void;
}

function readJsonDataFile(datafile: string, intoObject: IJsonLoadable): void {
	let dataPath = path.resolve(__dirname, datafile);
	let content: string = fs.readFileSync(dataPath, { encoding: "utf8" });
	if (content && intoObject["loadFromJsonObject"]) {
		intoObject.loadFromJsonObject(JSON.parse(content));
	}
}	

