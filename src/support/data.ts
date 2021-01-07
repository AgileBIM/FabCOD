import * as vscode from "vscode";
import { IJsonLoadable } from "../resources";

export class DataLibrary implements IJsonLoadable {
	loadFromJsonObject(data: object): void {
		throw new Error('Method not implemented.');
	}

}