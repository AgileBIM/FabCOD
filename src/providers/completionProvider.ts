import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { FabExt } from '../extension';
import { COD, CODutil } from '../support/document';
import { CODParser } from '../support/parser';


export class CompletionProviderCOD implements vscode.CompletionItemProvider {

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
		const result: Array<vscode.CompletionItem> = [];
		const cod: COD = FabExt.Documents.getDocument(document);		
		const line = document.lineAt(position.line).text;
		const parts = CODParser.segmentation(line);
		const relPos = new vscode.Position(0, position.character);
		const subidx = parts.findIndex(p => p.contains(relPos));
		const last = parts[subidx];

		if (last) {
			// you can probably use the same logic with the RUN command?
			if (last.isString && parts[subidx-1]?.value.toUpperCase() === 'INCLUDE' && position.character < last.getRange().end.character) {
				// anylize the current state of the path and help the user fill in the blanks
				const subParts = last.value.replace(/\"/g, '').replace(/\\/g, '/').split('/').filter(p => p !== '');
				let searchFor = '';
				if (subParts.length > 1) {
					searchFor = subParts.pop();
				}
				let allRefs: Array<fs.Dirent> = [];
				if (subParts[0].endsWith(":")) {
					allRefs = this.getLocalFilesRooted(last.value.replace(/\"/g, '').replace(/\\/g, '/'));
				} else {
					allRefs = this.getLocalFilesRelative(cod, subParts);
				}
				const found = allRefs.findIndex(p => p.name === searchFor);
				if (found !== -1 && allRefs[found].isDirectory()) {
					// make a suggestion for all files and folders at the exact level the user specified
					subParts.push(searchFor);
					allRefs = this.getLocalFilesRelative(cod, subParts);
					const folders = allRefs.filter(p => p.isDirectory());
					const files = allRefs.filter(p => p.isFile());
					folders.forEach(f => { 
						const ci = new vscode.CompletionItem(f.name + '/', vscode.CompletionItemKind.Folder);
						ci.sortText = '!';  // forces folders to be shown first
						result.push(ci); });
					files.forEach(f => { result.push(new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Reference)); });
				} else if (subParts[0].endsWith(":")) {
					// Handles drive rooted paths
					const folders = allRefs.filter(p => p.isDirectory());
					const files = allRefs.filter(p => p.isFile());
					folders.forEach(f => { 
						const ci = new vscode.CompletionItem(f.name + '/', vscode.CompletionItemKind.Folder);
						ci.sortText = '!'; // forces folders to be shown first
						result.push(ci); 
					});
					files.forEach(f => { result.push(new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Reference)); });
				} else {
					// offer up paths, but use the non-precise last user value as the searchfor that filters the list
					const folders = allRefs.filter(p => p.isDirectory() && (searchFor === '' || p.name.toUpperCase().startsWith(searchFor.toUpperCase())));
					const files = allRefs.filter(p => p.isFile() && (searchFor === '' || p.name.toUpperCase().startsWith(searchFor.toUpperCase())));
					folders.forEach(f => { 
						const ci = new vscode.CompletionItem(f.name + '/', vscode.CompletionItemKind.Folder);
						ci.sortText = '!';  // forces folders to be shown first
						result.push(ci); 
					});
					files.forEach(f => { result.push(new vscode.CompletionItem(f.name, vscode.CompletionItemKind.Reference)); });
				}
			} else if (last.value.toUpperCase() === 'INCLUDE') {
				// suggests files and sub-folders relative to the current COD's location in a fully quoted string format
				const bump = last.column + last.value.length === position.character ? ' ' : '';
				const allRefs = this.getLocalFilesRelative(cod);
				const folders = allRefs.filter(p => p.isDirectory());
				const files = allRefs.filter(p => p.isFile());
				folders.forEach(f => {					
					const ci = new vscode.CompletionItem(bump + '"' + f.name + '/"', vscode.CompletionItemKind.Folder);
					ci.sortText = '!'; // forces folders to be shown first
					result.push(ci);
				});
				files.forEach(f => { result.push(new vscode.CompletionItem(bump + '"' + f.name + '"', vscode.CompletionItemKind.Reference)); });
			} else {
				// NOTE: when you switch over to using the CODutil.findNearest you'll have to account for it being -1, which would be like just snippets and other global keywords
				const currIndex = CODutil.findNearestIndexAtPosition(cod, position);
				const ender = cod.entities[currIndex];
				const starter = ender ? CODutil.getSequenceStartEntity(cod, currIndex) : null;
				if (ender && (ender.value === '.' || !ender.isPrimitive)) {
					const typ = CODutil.getSequenceType(cod, starter, ender);
					const searchFor = ender.value.toUpperCase();
					if (FabExt.Data.objects[typ] || FabExt.Data.interfaces[typ]) {
						const focusObj = FabExt.Data.objects[typ] ?? FabExt.Data.interfaces[typ];
						focusObj.methods.forEach(item => {
							const upper = item.id.toUpperCase();
							if (searchFor === '.' || searchFor === '' || upper.startsWith(searchFor)) {								
								const info = Object.assign({}, item.info);
								info.returns = item.returns.join('|');
								result.push(FabExt.Data.getCompletionItem(item.id, vscode.CompletionItemKind.Method, '1', info));
							}
						});
						focusObj.properties.forEach(item => {
							const upper = item.id.toUpperCase();
							if (searchFor === '.' || searchFor === '' || upper.startsWith(searchFor)) {
								const info = Object.assign({}, item.info);
								info.returns = item.returns.join('|');
								result.push(FabExt.Data.getCompletionItem(item.id, item.returns[0].endsWith(']') ? vscode.CompletionItemKind.Module : vscode.CompletionItemKind.Property, '1', info));
							}
						});
					} else { // not a sequence
						const aci = FabExt.Data.AllCompletionItems;
						FabExt.Data.AllCompletionItems.concat(cod.keywords.allCompletionItems(cod)).forEach(item => {
							const upper = item.label.toUpperCase();
							if (searchFor === '.' || searchFor === '' || upper.startsWith(searchFor)) {
								if (item.kind === vscode.CompletionItemKind.Struct) {
									if (line.trim() === ender.value) {
										result.push(item);
									}
								} else {
									result.push(item);
								}
							}
						});
					}
					return new vscode.CompletionList(result);
				} else {
					if (line.trim() === '') {
						return new vscode.CompletionList(FabExt.Data.AllCompletionItems.concat(cod.keywords.allCompletionItems(cod)));
					} else {
						const cmplst = FabExt.Data.AllCompletionItems.concat(cod.keywords.allCompletionItems(cod));
						return new vscode.CompletionList(cmplst.filter(p => p.kind !== vscode.CompletionItemKind.Struct));
					}
					
				}
			}
		} else {
			if (line.trim() === '') {
				return new vscode.CompletionList(FabExt.Data.AllCompletionItems.concat(cod.keywords.allCompletionItems(cod)));
			} else {
				const cmplst = FabExt.Data.AllCompletionItems.concat(cod.keywords.allCompletionItems(cod));
				return new vscode.CompletionList(cmplst.filter(p => p.kind !== vscode.CompletionItemKind.Struct));
			}
		}
	}
	// resolveCompletionItem?(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
	// 	return item;
	// }

	getLocalFilesRooted(root: string): Array<fs.Dirent> {
		return fs.readdirSync(root, {withFileTypes: true});
	}

	getLocalFilesRelative(cod: COD, join?: Array<string>): Array<fs.Dirent> {
		let dir = path.join(path.dirname(cod.source.fileName), ...(join ? join : ['.']));
		return fs.readdirSync(dir, {withFileTypes: true});
	}

}