import { FabContextManager } from "./managers";
import * as vscode from 'vscode';
import { loadAllResources } from './resources';
import { loadAllCommands } from "./commands";

export const FabExt: FabContextManager = new FabContextManager();
loadAllResources();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	FabExt.initialize(context);
	loadAllCommands();
}

// this method is called when your extension is deactivated
export function deactivate() {}
