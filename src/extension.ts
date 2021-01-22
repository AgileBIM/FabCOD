import { FabContextManager } from "./managers";
import * as vscode from 'vscode';
import { loadAllResources } from './resources';
import { loadAllCommands } from "./commands";
//import { LanguageClient } from "vscode-languageclient";

//let client: LanguageClient;
export const FabExt: FabContextManager = new FabContextManager();
loadAllResources();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	FabExt.initialize(context);
	loadAllCommands();
}

// this method is called when your extension is deactivated
export function deactivate() {
	// if (!client) {
	// 	return undefined;
	// }
	// return client.stop();
}
