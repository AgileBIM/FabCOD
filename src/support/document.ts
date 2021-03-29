import * as vscode from 'vscode';
import * as nodepath from 'path';
import * as fs from 'fs-extra';
import { FabExt } from '../extension';
import { Entity, EntityCollection, ValueType, EntityType, ImportedEntity } from './entities';

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
    importedFunctions: Map<string, Array<ImportedEntity>> = new Map();
    includes: Array<string> = [];

    constructor(fspath: string) {
        this.creator = fspath;
    }

    getFunctionCompletionItems(cod: COD, excludes: Array<string>, context: string = 'User-Defined'): Array<vscode.CompletionItem> {
        let result: Array<vscode.CompletionItem> = [];
        const fKeys = [...this.functions.keys()];
        fKeys.forEach(key => { 
            const demarc = this.functions.get(key).find(x => cod.entities[x.index - 1]?.value.toUpperCase() === 'FUNCTION');
            if (demarc && !excludes.includes(key)) {
                const uci = FabExt.Data.getCompletionItem(demarc.value, vscode.CompletionItemKind.Function, '1', context);
                uci.detail = context;
                result.push(uci);
            }
        });
        
        cod.keywords.includes.forEach(fullPath => {
            if (fs.pathExistsSync(fullPath) === false) {
                const join = fullPath.split('/');
                fullPath = nodepath.join(nodepath.dirname(cod.source.fileName), ...(join ? join : ['.']));
            }            
            const parent = FabExt.Documents.getDocument(fullPath);
            if (parent) {
                result = result.concat(parent.keywords.getFunctionCompletionItems(parent, fKeys, 'Imported Func'));
            }
        });
        return result;
    }

    getVariableCompletionItems(cod: COD, excludes: string[], context: string = 'User-Defined'): Array<vscode.CompletionItem> {
        let result: Array<vscode.CompletionItem> = [];
        let imported: Array<vscode.CompletionItem> = [];
        let vkeys = [...this.variables.keys()].filter(p => !excludes.includes(p));
        vkeys.forEach(key => { 
            const demarc = this.variables.get(key).find(x => cod.entities[x.index - 1]?.value.toUpperCase() === 'DIM' || cod.entities[x.index - 1]?.value.toUpperCase() === 'OBJECT');            
            if (demarc) {
                // this makes a crude attempt to identify imported variables that are of global scope
                const starter = cod.entities[demarc.index-1];
                if (excludes.length === 0 || cod.contents.some(p => starter.column === 0 && p.line === demarc.line)) {
                    const uci = FabExt.Data.getCompletionItem(demarc.value, vscode.CompletionItemKind.Variable, '1', context);
                    uci.detail = context;
                    result.push(uci);
                }
            }
        });
        cod.keywords.includes.forEach(fullPath => {
            if (fs.pathExistsSync(fullPath) === false) {
                const join = fullPath.split('/');
                fullPath = nodepath.join(nodepath.dirname(cod.source.fileName), ...(join ? join : ['.']));
            }            
            const parent = FabExt.Documents.getDocument(fullPath);
            if (parent) {
                // I think there is a problem here because once a variable is used, then vKeys won't know it was declared in an import.
                imported = imported.concat(parent.keywords.getVariableCompletionItems(parent, vkeys, 'Imported Var'));
                vkeys = vkeys.concat(...parent.keywords.variables.keys());
            }
        });
        return result.concat(imported);
    }

    getAllCompletionItems(cod: COD): Array<vscode.CompletionItem> {
        const funcs = this.getFunctionCompletionItems(cod, []);
        const vars = this.getVariableCompletionItems(cod, []);
        return funcs.concat(vars);
    }
}



export namespace CODutil {
    export function lineAt(cod: COD, lineIndex: number): string {
        return cod.text.split('\n')[lineIndex];
    }

    // TODO: You should probably be making the variable version for use in the Completion provider
    export function hasImportedFunction_NotOverriden_ByActiveCOD(cod: COD, key: string): boolean {
        if (cod.keywords.importedFunctions.has(key)) {
            let result = true;
            const uses = cod.keywords.functions.get(key);
            if (!uses) {
                return result;
            } 
            uses.forEach(ucase => {                
                const previous = cod.entities[ucase.index-1];
                if (previous && previous.value.toUpperCase() === 'FUNCTION') {
                    result = false;
                }
            });
            return result;
        } else {
            return false;
        }
    }

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