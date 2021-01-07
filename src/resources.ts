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
	var dataPath = path.resolve(__dirname, datafile);
	fs.readFile(dataPath, "utf8", function(err: Error, data: string) {        
		if (err === null && intoObject["loadFromJsonObject"]) {
			intoObject.loadFromJsonObject(JSON.parse(data));
		}
	});    
}	

