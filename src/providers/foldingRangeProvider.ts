import { FabExt } from "../extension";
import * as vscode from 'vscode';
import { EntityCollection, Entity, EntityType } from '../support/entities';

export class FoldingProviderCOD implements vscode.FoldingRangeProvider {
	onDidChangeFoldingRanges?: vscode.Event<void>;
	provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
		const cod = FabExt.Documents.getDocument(document);
		const result: vscode.FoldingRange[] = this.extractRanges(cod.contents);
		result.push(...this.extractCommentRegions(cod.entities));
		if (result.length >= 1) {
			return result;
		} else {
			return;
		}
	}

	private extractCommentRegions(ents: Array<Entity>): Array<vscode.FoldingRange> {
		const rxStart = /\s*REM #?REGION.*/i;
		const rxEnder = /\s*REM #?END\s*REGION.*/i;
		const starters: Array<Entity> = ents.filter(p => p.isComment && rxStart.test(p.value));
		const endings: Array<Entity> = ents.filter(p => p.isComment && rxEnder.test(p.value));
		const result: vscode.FoldingRange[] = [];
		for (let i = 0; i < starters.length; i++) {
			const s = starters[i];
			const e = endings[i];
			if (s && e && s.line < e.line) {
				result.push(new vscode.FoldingRange(s.line, e.line, vscode.FoldingRangeKind.Comment));
			}
		}
		return result;
	}

	private isFoldable(col: EntityCollection): boolean {
		switch (col.entityType) {
			case EntityType.DO:
			case EntityType.FOR:
			case EntityType.FUNCTIONDEF:
			case EntityType.IF:
			case EntityType.WHILE:
				return true;
			default:
				return false;
		}
	}

	private extractRanges(col: Array<Entity|EntityCollection>): Array<vscode.FoldingRange> {
		const result: vscode.FoldingRange[] = [];
		col.forEach(ent => {
			if (ent instanceof EntityCollection) {
				if (this.isFoldable(ent)) {
					const range = ent.getRange();
					result.push(new vscode.FoldingRange(range.start.line, range.end.line, vscode.FoldingRangeKind.Region));
				}
				result.push(...this.extractRanges(ent.children));
			}
		});
		return result;
	}

}