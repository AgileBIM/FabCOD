import * as vscode from 'vscode';
import { TextDocument  } from "vscode";
import * as cod from "./entities";
import { Entity, EntityCollection, ValueType } from "./entities";


export namespace CODParser {    
    interface IndexTracker {
        idx: number;  
    }
    const symbols = ['+', '-', '*', '/', '=', '<', '>', '(', ')', '[', ']', ','];    
    const blockStarters = ['IF', 'ELSE', 'ELSEIF', 'FOR', 'WHILE', 'DO', 'SELECT', 'CASE', 'FUNCTION'];

    // When this document is completely done, this will be the only exported function
    export function getEntities(doc: string|vscode.TextDocument) : EntityCollection {
        return new cod.ContentsEntity(formulation(segmentation(doc instanceof Object ? doc.getText() : doc)));
    }






//#region Block Formulation EntityCollection Handlers
    function processIF(ents: Array<Entity>, tracker: IndexTracker): cod.IfEntity|cod.InlineIfEntity {
        const start = ents[tracker.idx];
        const header = ents.filter(p => p.line === start.line);
        const then = header.findIndex(p => p.value.toUpperCase() === 'THEN');
        const test = new cod.ContentsEntity(header.slice(1, then));
        tracker.idx += header.length;
        if (then === tracker.idx - 1) { // full IF
            const body: Array<Entity|EntityCollection> = [];
            for (tracker.idx; tracker.idx < ents.length;) {
                const curr = ents[tracker.idx];
                const upper = curr.value.toUpperCase();
                if (blockStarters.includes(upper)) {
                    body.push(createBlockCollection(ents, tracker));
                } else {
                    if (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF') {
                        const result = [start, test, ents[then], new cod.ContentsEntity(body), curr, ents[tracker.idx+1]];                        
                        tracker.idx += 2;
                        return new cod.IfEntity(result);
                    } else if (upper === 'ENDIF') {
                        tracker.idx++;
                        return new cod.IfEntity([start, test, ents[then], new cod.ContentsEntity(body), curr]);
                    } else {
                        body.push(createLineCollection(ents, tracker));
                    }
                }
            }
        } else { // 1-liner IF
            const body = new cod.ContentsEntity(header.slice(then + 1));
            return new cod.InlineIfEntity([start, test, header[then], body]);
        }
    }

    function processELSEIF(ents: Array<Entity>, tracker: IndexTracker): cod.ElseIfEntity|cod.InlineIfEntity {
        const ELSE = ents[tracker.idx];
        let IF: Entity;
        if (ents[tracker.idx].value.toUpperCase() === 'IF') {
            IF = ents[tracker.idx++];
        }        
        const header = ents.filter(p => p.line === ELSE.line);
        const then = header.findIndex(p => p.value.toUpperCase() === 'THEN');
        const test = new cod.ContentsEntity(header.slice(1, then));
        tracker.idx += header.length;
        if (then === tracker.idx - 1) { // full ELSEIF
            const body: Array<Entity|EntityCollection> = [];
            for (tracker.idx; tracker.idx < ents.length;) {
                const curr = ents[tracker.idx];
                const upper = curr.value.toUpperCase();
                if (blockStarters.includes(upper)) {
                    body.push(createBlockCollection(ents, tracker));
                } else if (upper === 'ENDIF' || (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF')) {                        
                    if (IF) {
                        return new cod.ElseIfEntity([ELSE, IF, test, header[then], new cod.ContentsEntity(body)]);
                    } else {
                        return new cod.ElseIfEntity([ELSE, test, header[then], new cod.ContentsEntity(body)]);
                    }                        
                } else {
                    body.push(createLineCollection(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }
        } else { // 1-liner ELSEIF
            const body = new cod.ContentsEntity(header.slice(then + 1));
            if (IF) {
                return new cod.InlineIfEntity([ELSE, IF, test, header[then], body]);
            } else {
                return new cod.InlineIfEntity([ELSE, test, header[then], body]);
            }
        }
    }


    function processELSE(ents: Array<Entity>, tracker: IndexTracker): cod.ElseEntity {
        return null as cod.ElseEntity;
    }

    function processFOR(ents: Array<Entity>, tracker: IndexTracker): cod.LoopEntity {
        return null as cod.LoopEntity;
    }

    function processWHILE(ents: Array<Entity>, tracker: IndexTracker): cod.LoopEntity {
        return null as cod.LoopEntity;
    }

    function processDO(ents: Array<Entity>, tracker: IndexTracker): cod.LoopEntity {
        return null as cod.LoopEntity;
    }

    function processSELECT(ents: Array<Entity>, tracker: IndexTracker): cod.SelectEntity {
        return null as cod.SelectEntity;
    }

    function processCASE(ents: Array<Entity>, tracker: IndexTracker): cod.CaseEntity {
        return null as cod.CaseEntity;
    }

    function processFUNCDEF(ents: Array<Entity>, tracker: IndexTracker): cod.FunctionDefinitionEntity {
        return null as cod.FunctionDefinitionEntity;
    }
//#endregion Block Formulation EntityCollection Handlers







//#region Block Formulation Flow Control
    
    // the tracker idx increments are handled by the callers of this function. This is supposed to enhance a finite non-blocking scope that would appear on a single line.
    // This ents this function recieves could be an entire line, but it could also be the expression portion of an IF, the body portion of an InlineIf or various other "parts" of other things.
    function processEntityRun(ents: Array<Entity>) : EntityCollection { 
        const result: Array<Entity|EntityCollection> = [];
        for (let i = 0; i < ents.length; i++) {
            const prev = ents[i-1];
            const curr = ents[i];
            const next = ents[i+1];
            // enhance this to do special work with dotted pairs, functions, varaibles, etcetera
            result.push(curr);
        }
        return new EntityCollection(result, cod.EntityType.SEQUENCE);
    }


    function createBlockCollection(ents: Array<Entity>, tracker: IndexTracker): EntityCollection {        
        // determine what the starter type is and return that unique type
        const target = ents[tracker.idx].value.toUpperCase();
        switch (target) {
        case 'IF':
            return processIF(ents, tracker);
        case 'ELSEIF':
            return processELSEIF(ents, tracker);
        case 'ELSE':
            if (ents[tracker.idx + 1].value.toUpperCase() === 'IF') {
                return processELSEIF(ents, tracker);
            } else {
                return processELSE(ents, tracker);
            }
        case 'FOR':
            return processFOR(ents, tracker);
        case 'WHILE':
            return processWHILE(ents, tracker);
        case 'DO':
            return processDO(ents, tracker);
        case 'SELECT':
            return processSELECT(ents, tracker);
        case 'CASE':
            return processCASE(ents, tracker);
        case 'FUNCTION':
            return processFUNCDEF(ents, tracker);
        default:
            return createLineCollection(ents, tracker);
        }
    }


    // This is mostly handling the extraction of a lines Entities and updating the tracker. The ProcessEntityRun() handles all the details of those contents.
    function createLineCollection(ents: Array<Entity>, tracker: IndexTracker): EntityCollection {
        const first = ents[tracker.idx];
        const content = ents.filter(p => p.line === first.line);
        tracker.idx += content.length;
        return processEntityRun(ents);
    }


    export function formulation(ents: Array<Entity>, returnAtNextBlock: boolean = false): Array<Entity|EntityCollection> {
        const result: Array<Entity|EntityCollection> = [];
        const tracker = { idx: 0 };
        for (tracker.idx; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            if (blockStarters.includes(curr.value.toUpperCase())) { // Process Block Types
                if (returnAtNextBlock) {
                    break;
                } else {
                    result.push(createBlockCollection(ents, tracker));
                    // tracker.idx++; <-- expected to happen in the createCollection
                }
            } else if (curr.isComment === true) { // Collect Comments
                result.push(curr);
                tracker.idx++;
            } else { // Process and store an insignificant Line as a single Collection
                result.push(createLineCollection(ents, tracker));
            }
        }
        return result;
    }

//#endregion Block Formulation Flow Control






//#region Primitive Segmentation Handlers
    export function segmentation(text: string): Array<Entity> {
        const result: Array<Entity> = [];
        let temp: Entity | null = null;
        let lnum = 0;
        let col = 0;
        let state: ValueType = ValueType.UNKNOWN;
        for (let i = 0; i < text.length; i++) {
            let curr = text[i];

            switch (state as string) {
                case ValueType.COMMENT:
                    if (curr === '\r' || curr === '\n') {
                        result.push(temp);
                        temp = null;
                        state = ValueType.UNKNOWN;
                    } else {
                        temp.value += curr;
                    }
                    break;
                case ValueType.STRING:
                    if (curr === '\r' || curr === '\n') {
                        temp.valueType = ValueType.ERROR;
                        result.push(temp);
                        temp = null;
                        state = ValueType.UNKNOWN;
                    } else if (curr === '"') {
                        temp.value += curr;
                        result.push(temp);
                        temp = null;
                        state = ValueType.UNKNOWN;
                    } else {
                        temp.value += curr;
                    }
                    break;
                case ValueType.NUMBER: // COD's do not support scientific, but all of these are considered valid numbers -.25 / .25 / 0.25 
                    if (/[0-9\.]/.test(curr)) {
                        temp.value += curr;
                    } else {
                        if (temp) {
                            result.push(temp);
                        }
                        // just reset this run so I can keep all the initialization logic in the UNKNOWN context
                        state = ValueType.UNKNOWN;
                        temp = null;
                        i--;
                        col--;
                        curr = '';
                    }
                    break;
                case ValueType.UNKNOWN:
                    if (temp === null && curr === '-') {
                        const next1 = text[i + 1]; // could be . or #
                        const next2 = text[i + 2]; // could be #
                        if (next1 && /\d/.test(next1)) {
                            temp = new Entity(cod.EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col);
                            state = ValueType.NUMBER;
                        } else if (next1 && next1 === '.' && next2 && /\d/.test(next2)) {
                            temp = new Entity(cod.EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col);
                            state = ValueType.NUMBER;
                        } else {
                            result.push(new Entity(cod.EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col));
                        }
                    } else if (temp === null && curr === '.') {
                        const next1 = text[i + 1]; // If this is a # start NUMBER else log this symbol as its own DOTTED entity and stay UNKNOWN
                        if (next1 && /\d/.test(next1)) {
                            temp = new Entity(cod.EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col);
                            state = ValueType.NUMBER;
                        } else {
                            result.push(new Entity(cod.EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col));
                        }
                    } else if (temp === null && /\d/.test(curr)) {
                        temp = new Entity(cod.EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col);
                        state = ValueType.NUMBER;
                    } else if (symbols.includes(curr)) {
                        if (temp) {
                            result.push(enhancePrimitives(temp));
                            temp = null;
                        }
                        result.push(new Entity(cod.EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col));
                    } else if (curr === '"') {
                        if (temp) {
                            result.push(enhancePrimitives(temp));
                            temp = null;
                        }
                        temp = new Entity(cod.EntityType.ENTITY, ValueType.STRING, curr, lnum, col);
                        state = ValueType.STRING;
                    } else {
                        let handled = false;
                        if (curr.toUpperCase() === 'R') {
                            const next1 = text[i + 1];
                            const next2 = text[i + 2];
                            const next3 = text[i + 3];
                            if (next1 && next2 && next3 && (curr + next1 + next2 + next3).toUpperCase() === 'REM ') {
                                if (temp) {
                                    result.push(enhancePrimitives(temp));
                                    temp = null;
                                }
                                temp = new Entity(cod.EntityType.ENTITY, ValueType.COMMENT, curr, lnum, col);
                                state = ValueType.COMMENT;
                                handled = true;
                            }
                        }
                        if (!handled) {
                            if (/\s/.test(curr)){
                                if (temp) {
                                    result.push(enhancePrimitives(temp));
                                    temp = null;
                                }
                            } else if (temp) {
                                temp.value += curr;
                            } else {
                                temp = new Entity(cod.EntityType.ENTITY, ValueType.UNKNOWN, curr, lnum, col);
                            }
                        }
                    }
            }
            // walks the document so Entities get created with accurate Line & Column references
            if (curr === '\n') {
                lnum++;
                col = 0;
            } else {
                col++;
            }
        }
        if (temp) {
            result.push(enhancePrimitives(temp));
        }
        return result;
    } // End tokenize()


    function enhancePrimitives(ent: Entity) {
        switch (ent.value.toUpperCase()) {
            case 'NULL':
                ent.valueType = ValueType.NULL;
                break;
            case 'NOTHING':
                ent.valueType = ValueType.NOTHING;
                break;
            case 'TRUE':
                ent.valueType = ValueType.BOOL;
                break;
            case 'FALSE':
                ent.valueType = ValueType.BOOL;
                break;
            case 'VOID':
                ent.valueType = ValueType.VOID;
                break;
            default:
                // TODO: expand this to detect all known keywords & constants once that resource is compiled.
                break;
        }
        return ent;
    }
//#endregion Primitive Segmentation Handlers


}