import { FabContextManager } from "./managers";
import { CODParser } from "./support/parser";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "FabCOD" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cadmepext.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		const values = FabExt.Documents.WorkspaceDocuments;
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from cadmepext!');
	});

	context.subscriptions.push(disposable);
	const d: any = CODParser.createCOD(vscode.window.activeTextEditor.document);
	const stop = 'here';
}

// this method is called when your extension is deactivated
export function deactivate() {}
