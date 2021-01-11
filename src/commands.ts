import { FabExt } from "./extension";
import * as vscode from 'vscode';
import { CODParser, COD } from "./support/parser";
import { Entity, EntityType, ValueType } from './support/entities';

export function loadAllCommands() {

	vscode.languages.registerHoverProvider(FabExt.selector, new HoverProviderCOD());





}


class HoverProviderCOD implements vscode.HoverProvider {
	provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		const line = document.lineAt(position.line).text;
		const cod = FabExt.Documents.getDocument(document);
		const found = cod.entities.find(p => p.contains(position));		
		if (found) {
			let res: vscode.MarkdownString;
			if (found.valueType === ValueType.CONSTANT) {
				res = FabExt.Data.getNamedObjectMarkdown(found.value);
			} else if (found.valueType === ValueType.OBJECT) {
				res = FabExt.Data.getObjectMarkdown(found.value);
			} else if (found.valueType === ValueType.KEYWORD || found.valueType === ValueType.VARIABLE) {
				switch (found.entityType) {
					case EntityType.ENTITY:
					case EntityType.DOTTED:
						if (FabExt.Data.objects[found.value.toUpperCase()]) {
							res = FabExt.Data.getObjectMarkdown(found.value);	
						} else if (cod.keywords.variables.has(found.value.toUpperCase())) {
							const ents = cod.keywords.variables.get(found.value.toUpperCase());
							const firstSet = ents.find(p => cod.entities[p.index - 1]?.value.toUpperCase() === 'DIM' || cod.entities[p.index - 1]?.value.toUpperCase() === 'OBJECT');
							if (firstSet) {
								for (let i = firstSet.index + 1; i <= firstSet.index + 3; i++) {
									const element = cod.entities[i].value.toUpperCase();
									if (['=', 'AS', 'NEW'].includes(element) === false) {
										const setter = cod.entities[i];
										if (cod.entities[setter.index+1].value !== '.') {
											res = FabExt.Data.getObjectMarkdown(cod.entities[i].value);
										}
										break;
									}
								}
							}
						}						
						break;
					case EntityType.INDEXED:
					case EntityType.METHOD:
					case EntityType.PROPERTY:
						res = FabExt.Data.getDottedMarkdown(cod, found);	
						break;
					default:
						if (FabExt.Data.objects[found.value.toUpperCase()]) {
							res = FabExt.Data.getObjectMarkdown(found.value);	
						} else {
							res = FabExt.Data.getNamedObjectMarkdown(found.value);
						}
						break;
				}
			}
			if (res) {
				return new vscode.Hover(res);
			} else {
				return;
			}
		} else {
			return;
		}
		// 	vscode.env.openExternal(vscode.Uri.parse(urlPath));
	}

}