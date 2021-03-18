import * as vscode from 'vscode';
import { FabExt } from '../extension';
import { COD, CODutil } from '../support/document';
import * as dataTypes from '../support/data';
//import { Argument, Function } from "../support/data";
//////////////////////////////////////////////////////////////////Need to get imported function arguments working
export let lastSigContext: vscode.SignatureHelpContext = null;
export let lastSigArgs: Array<dataTypes.Argument>;

export class SignatureHelpProviderCOD implements vscode.SignatureHelpProvider {	
	provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext): vscode.ProviderResult<vscode.SignatureHelp> {
		lastSigContext = context;
		if (context && context.triggerCharacter === ')') {
			return;
		} else if (context && context.activeSignatureHelp && context.triggerCharacter === ',') {
			if (context.activeSignatureHelp.activeParameter + 1 < context.activeSignatureHelp.signatures[0].parameters.length) {
				context.activeSignatureHelp.activeParameter++;
			}
			return context.activeSignatureHelp;
		} else {
			const cod: COD = FabExt.Documents.getDocument(document);
			const items = cod.entities.filter(p => p.line === position.line);
			let currIndex = CODutil.findNearestIndexAtPosition(cod, position);		
			if (currIndex === -1 && context.activeSignatureHelp) {
				currIndex = items.findIndex(p => p.column >= position.character) - 1;
			}
			const index = items.findIndex(p => p.index === currIndex);
			if (currIndex < 0 || (cod.entities[currIndex].value === ')' && position.character > cod.entities[currIndex].column)) {
				return;
			} else {
				let count = cod.entities[currIndex].value === ')' ? 0 : 1;
				let qty = 0;
				let i = index;
				for (; i >= 0; i--) {
					if (items[i].value === ')') {
						count++;
					} else if (items[i].value === '(') {
						count--;
					}
					if (count === 1 && items[i].value === ',') {
						qty++;
					}
		
					if (count === 0) {
						i--;
						break;
					}
				}
				if (count === 0) {					
					const starter = CODutil.getSequenceStartEntity(cod, items[i].index);
					const ender = items[i];
					const [typName, funcprop] = FabExt.Data.getDotSeqTypeName(cod, starter, ender);					
					if (funcprop && funcprop['args']) {
						const meth: dataTypes.Function = funcprop as dataTypes.Function;
						const sig = new vscode.SignatureHelp();		
						const siginfo = new vscode.SignatureInformation(meth.id, FabExt.Data.getDottedMarkdown(cod, ender));	
						lastSigArgs = meth.args;					
						meth.args.forEach((arg: dataTypes.Argument, idx) => {
							const parinfo = new vscode.ParameterInformation(arg.id, FabExt.Data.getArgumentMarkdown(arg));
							siginfo.parameters.push(parinfo);
						});
						sig.activeParameter = qty;
						sig.signatures.push(siginfo);
						return sig;
					} else if (FabExt.Data.functions[ender.value.toUpperCase()]) {
						const sig = new vscode.SignatureHelp();		
						const meth = FabExt.Data.functions[ender.value.toUpperCase()];
						const siginfo = new vscode.SignatureInformation(meth.id, FabExt.Data.getNamedObjectMarkdown(ender.value.toUpperCase()));
						lastSigArgs = meth.args;
						meth.args.forEach((arg: dataTypes.Argument, idx) => {
							const parinfo = new vscode.ParameterInformation(arg.id, FabExt.Data.getArgumentMarkdown(arg));
							siginfo.parameters.push(parinfo);
						});
						sig.activeParameter = qty;
						sig.signatures.push(siginfo);
						return sig;	
					} else if (CODutil.hasImportedFunction_NotOverriden_ByActiveCOD(cod, ender.value.toUpperCase())) {
						const deflist = cod.keywords.importedFunctions.get(ender.value.toUpperCase());
						const refPath = deflist[0].filePath;
						const parent = FabExt.Documents.getDocument(refPath);
						if (!parent) {
							return;
						}
						const defstart = deflist.find(p => parent.entities[p.index - 1]?.value.toUpperCase() === 'FUNCTION');
						if (defstart) {
							const sig = new vscode.SignatureHelp();
							sig.signatures.push(new vscode.SignatureInformation(CODutil.lineAt(parent, defstart.line).trim()));
							return sig;
						} else {
							return;
						}
					} else if (cod.keywords.functions.has(ender.value.toUpperCase())) {
						const deflist = cod.keywords.functions.get(ender.value.toUpperCase());
						const defstart = deflist.find(p => cod.entities[p.index - 1].value.toUpperCase() === 'FUNCTION');
						if (defstart) {
							const sig = new vscode.SignatureHelp();
							sig.signatures.push(new vscode.SignatureInformation(document.lineAt(defstart.line).text.trim()));
							return sig;
						} else {
							return;
						}
					} else {
						return;
					}
				} else {
					return;
				}
			}
		}
	}
}