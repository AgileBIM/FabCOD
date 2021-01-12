import { FabExt } from "./extension";
import * as vscode from 'vscode';
import { HoverProviderCOD } from './providers/hoverProvider';
import { FoldingProviderCOD } from './providers/foldingRangeProvider';

export function loadAllCommands() {
	FabExt.Subscriptions.push(vscode.languages.registerHoverProvider(FabExt.selector, new HoverProviderCOD()));
	FabExt.Subscriptions.push(vscode.languages.registerFoldingRangeProvider(FabExt.selector, new FoldingProviderCOD()));
	
	
	FabExt.Subscriptions.push(vscode.commands.registerCommand('fabext.acadexecute', () => {
		try {
			if (vscode.window.activeTextEditor?.document && FabExt.Documents.isValidCOD(vscode.window.activeTextEditor.document.fileName)) {
				executeScript(vscode.window.activeTextEditor.document.fileName);
			}
		}
		catch (err) {}
	}));

	// Associated with the right click "Insert Region" menu item
	FabExt.Subscriptions.push(vscode.commands.registerCommand("fabext.insertregion", async () => {
		try {
			const linefeed = vscode.window.activeTextEditor.document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
			const commentChar = 'REM ';
			const snip = new vscode.SnippetString(commentChar + '#region ${1:description}' + linefeed + '${TM_SELECTED_TEXT}' + linefeed + commentChar + "#endregion");
			await vscode.window.activeTextEditor.insertSnippet(snip);
		}
		catch (err) { vscode.window.showErrorMessage('Failed to insert snippet', err); }
	}));



}








import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';

function executeScript(path: string) {
	if (process.platform === 'win32') { 
		const procPath = join(__dirname, 'support', 'ExecuteInAcad.exe');
		let proc: ChildProcess = spawn(procPath, [ path ]);
		proc.stdout.setEncoding('utf8');
		proc.stdout.on('data', lines(line => {
			if (line.includes('Success') === false) {
				const msg = line.trim().replace('->', ': ');
				vscode.window.showInformationMessage(msg);
			}
		}));
	}		
}

function lines(callback: (a: string) => void) {
	let unfinished = '';
	return (data: string | Buffer) => {
		const lines = data.toString().split(/\r?\n/);
		const finishedLines = lines.slice(0, lines.length - 1);
		finishedLines[0] = unfinished + finishedLines[0];
		unfinished = lines[lines.length - 1];
		for (const s of finishedLines) {
			callback(s);
		}
	};
}
