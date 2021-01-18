import * as vscode from 'vscode';
import { FabExt } from '../extension';
import { Entity, EntityCollection, ValueType, EntityType } from './entities';

 export interface COD {
    text: string;
    contents: Array<Entity|EntityCollection>;
    entities: Array<Entity>;
    keywords: NameTracker;
    source: vscode.TextDocument;
}

export class NameTracker {
    creator: string = '';
    variables: Map<string, Array<Entity>> = new Map();
    skipped: Array<Entity> = [];
    functions: Map<string, Array<Entity>> = new Map();
    importedFunctions: Map<string, Array<Entity>> = new Map();
    includes: Array<string> = [];

    constructor(fspath: string) {
        this.creator = fspath;
    }

    allCompletionItems(cod: COD): Array<vscode.CompletionItem> {
        const result: Array<vscode.CompletionItem> = [];
        const fkeys = [...this.functions.keys()];
        fkeys.forEach(key => { 
            const demarc = this.functions.get(key).find(x => cod.entities[x.index - 1]?.value.toUpperCase() === 'FUNCTION');
            if (demarc) {
                const uci = FabExt.Data.getCompletionItem(demarc.value, vscode.CompletionItemKind.Function, '1', 'User Defined');
                uci.detail = 'User-Defined';
                result.push(uci);
            }
        });
        const vkeys = [...this.variables.keys()];
        vkeys.forEach(key => { 
            const demarc = this.variables.get(key).find(x => cod.entities[x.index - 1]?.value.toUpperCase() === 'DIM' || cod.entities[x.index - 1]?.value.toUpperCase() === 'OBJECT');
            if (demarc) {
                const uci = FabExt.Data.getCompletionItem(demarc.value, vscode.CompletionItemKind.Variable, '1', 'User Defined');
                uci.detail = 'User-Defined';
                result.push(uci);
            }
        });
        return result;
    }
}



export namespace CODutil {
    export function findNearestIndexAtPosition(cod: COD, pos: vscode.Position): number {
        let idx = cod.entities.findIndex(p => p.line === pos.line && (p.column === pos.character || p.column + p.value.length === pos.character));
        if (idx === -1) {
            idx = cod.entities.find(p => p.contains(pos))?.index ?? -1;
        }
        if (idx === -1) {
            return -1;
        } else if (cod.entities[idx].column === pos.character) {
			return idx;
		} else if (cod.entities[idx-1] && cod.entities[idx-1].column === pos.character) {
			return idx - 1;
		} else if (cod.entities[idx-1] && cod.entities[idx-1].column + cod.entities[idx-1].value.length  === pos.character) {
			return idx - 1;
		} else if (cod.entities[idx].contains(pos)) {
            return idx;
        } else if (cod.entities[idx-1] && cod.entities[idx-1].contains(pos)) {
            return idx - 1;
        } else if (idx - 1 >= 0) {
            return idx - 1;
        } else {
            return idx;
        }
    }

    export function forwardScanUntil(cod: COD, idx: number, starts: string, stops: string): number {
        let count = 0;
        if (cod.entities[idx].value !== starts) {
            count++;
        }
        do {
            if (cod.entities[idx].value === starts) {
                count++;
            } else if (cod.entities[idx].value === stops) {
                count--;
            }
            idx++;
        } while (count >= 1 && idx < cod.entities.length);
        return idx === -1 || idx >= cod.entities.length ? cod.entities.length - 1 : idx;
    }

    export function backwardScanUntil(cod: COD, idx: number, starts: string, stops: string): number {
        let count = 0;
        if (cod.entities[idx].value !== stops) {
            count++;
        }
        do {
            if (cod.entities[idx].value === stops) {
                count++;
            } else if (cod.entities[idx].value === starts) {
                count--;
            }
            idx--;
        } while (count >= 1 && idx >= 0);
        return idx === -1 ? 0 : idx;
    }

    export function getSequenceStartEntity(cod: COD, index: number|vscode.Position|Entity): Entity {
        const stopChars = [',', '[', '('];
        let i = (index instanceof vscode.Position) ? findNearestIndexAtPosition(cod, index) : (index instanceof Entity) ? index.index : index;
        const lineLock = cod.entities[i].line;
        let starter: Entity;
        let flag = true;
        while (flag) {
            if (!cod.entities[i] || cod.entities[i]?.line !== lineLock) {
                flag = false;
            } else if(cod.entities[i].value === ')') {
                i = backwardScanUntil(cod, i, '(', ')');
            } else if(cod.entities[i].value === ']') {
                i = backwardScanUntil(cod, i, '[', ']');
            } else if (stopChars.includes(cod.entities[i].value)) {
                flag = false;
            } else {
                if (!starter) {
                    starter = cod.entities[i];
                } else if (cod.entities[i].column + cod.entities[i].value.length === cod.entities[i+1].column) {
                    starter = cod.entities[i];
                } else {
                    flag = false;
                }
                i--;
            }
        }
        return starter;
	}

	export function getSequenceType(cod: COD, start: Entity, end: Entity): string {
		let prevType: string = '';
		for (let i = start.index; i <= end.index; i++) {
			const curr = cod.entities[i];
			if (!curr.isPrimitive) {
				if (prevType === '' && curr.valueType === ValueType.OBJECT) {
					prevType = curr.value.toUpperCase().replace(/\[\]/g, '');
				} else if (curr.valueType === ValueType.VARIABLE) {
					const ents = cod.keywords.variables.get(curr.value.toUpperCase());
					const firstSet = ents.find(p => cod.entities[p.index - 1]?.value.toUpperCase() === 'DIM' || cod.entities[p.index - 1]?.value.toUpperCase() === 'OBJECT');
					if (firstSet) {
						for (let k = firstSet.index + 1; k <= firstSet.index + 3; k++) {
							const possibleType = cod.entities[k].value.toUpperCase();
							if (FabExt.Data.objects[possibleType]) {
								prevType = possibleType.replace(/\[\]/g, '');
								break;
							}
						}
					}
				} else if (curr.entityType === EntityType.INDEXED || curr.entityType === EntityType.PROPERTY) {
					const objBase = FabExt.Data.objects[prevType] ?? FabExt.Data.interfaces[prevType];
					if (prevType && objBase) {
						const prop = objBase.properties.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						if (prop) {
							prevType = prop.returns[0].toUpperCase().replace(/\[\]/g, '');
						}
					}
				} else if (curr.entityType === EntityType.METHOD) {
					const objBase = FabExt.Data.objects[prevType] ?? FabExt.Data.interfaces[prevType];
					if (prevType && objBase) {
						const prop = objBase.methods.find(p => p.id.toUpperCase() === curr.value.toUpperCase());
						if (prop) {
							prevType = prop.returns[0].toUpperCase().replace(/\[\]/g, '');
						}
					}
				}
			} else if (curr.value === '(') {
				i = CODutil.forwardScanUntil(cod, i, '(', ')');
			} else if (curr.value === '[') {
				i = CODutil.forwardScanUntil(cod, i, '[', ']');
			}
		}
		return prevType;
	}


} // end namespace CODutil