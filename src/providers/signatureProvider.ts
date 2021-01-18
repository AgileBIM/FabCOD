import * as vscode from 'vscode';
import { FabExt } from '../extension';
import { COD, CODutil } from '../support/document';
import { Argument, Function } from "../support/data";

export class SignatureHelpProviderCOD implements vscode.SignatureHelpProvider {
	provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext): vscode.ProviderResult<vscode.SignatureHelp> {
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
					const [typName, meth] = FabExt.Data.getDotSeqTypeName(cod, starter, ender);
					if (meth instanceof Function) {
						const sig = new vscode.SignatureHelp();		
						const siginfo = new vscode.SignatureInformation(meth.id, FabExt.Data.getDottedMarkdown(cod, ender));						
						meth.arguments.forEach((arg: Argument, idx) => {
							const parinfo = new vscode.ParameterInformation(arg.id, FabExt.Data.getArgumentMarkdown(arg));
							siginfo.parameters.push(parinfo);
						});
						sig.activeParameter = qty;
						sig.signatures.push(siginfo);
						return sig;
					} else if (FabExt.Data.functions[ender.value.toUpperCase()]) {

						const sig = new vscode.SignatureHelp();		
						const meth = FabExt.Data.functions[ender.value.toUpperCase()];
						const siginfo = new vscode.SignatureInformation(meth.id, FabExt.Data.getDottedMarkdown(cod, ender));						
						meth.args.forEach((arg: Argument, idx) => {
							const parinfo = new vscode.ParameterInformation(arg.id, FabExt.Data.getArgumentMarkdown(arg));
							siginfo.parameters.push(parinfo);
						});
						sig.activeParameter = qty;
						sig.signatures.push(siginfo);
						return sig;
					} else if (cod.keywords.functions.has(ender.value.toUpperCase())) {
						const sig = new vscode.SignatureHelp();
						sig.signatures.push(new vscode.SignatureInformation(ender.value));
						return sig;
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