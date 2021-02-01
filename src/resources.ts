import * as path from 'path';
import * as fs from 'fs-extra';
import { DataLibrary, SnippetLibrary, PatternLibrary } from "./support/data";

export const library: DataLibrary = new DataLibrary();
export const snippets: SnippetLibrary = new SnippetLibrary();
export const patterns: PatternLibrary = new PatternLibrary();

export function loadAllResources(){
	readJsonDataFile("./support/FabricationDefinition.json", library);
	readJsonDataFile("./support/DimOptionChoices.json", patterns);
	readJsonDataFile("./support/codscript-snippets.json", snippets);
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

