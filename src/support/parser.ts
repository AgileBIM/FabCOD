import * as vscode from 'vscode';
import * as path from 'path';
import { 
    Entity, 
    EntityCollection, 
    ValueType, 
    CaseEntity, 
    ContentsEntity, 
    DoUntilEntity, 
    DoWhileEntity, 
    ElseEntity, 
    ElseIfEntity, 
    EntityType, 
    ForNextEntity, 
    FunctionDefinitionEntity, 
    IfEntity, 
    InlineIfEntity,
    SelectEntity, 
    SequenceEntity, 
    WhileEntity, 
    stdSymbols,
    blockStarters
 } from "./entities";
import { FabExt } from '../extension';

 export interface COD {
    contents: string;
    entities: Array<Entity|EntityCollection>;
    refs: NameTracker;
}
export interface  NameTracker {
    creator: string;
    variables: Map<string, Array<Entity>>;
    functions: Map<string, Array<Entity>>;
    importedFunctions: Map<string, Array<Entity>>;
    includes: Array<string>;
}

export namespace CODParser {
    interface IndexTracker {
        idx: number;  
        ids: NameTracker;
    }

    // When this document is completely done, this will be the only exported function
    export function getEntities(doc: string|vscode.TextDocument, parent?: NameTracker) : COD {
        // requester needs to be used to ensure that 2 COD's don't create an infinate loop by including each other as references.
        const text = doc instanceof Object ? doc.getText() : doc;
        const ids: NameTracker = parent ? parent : {
            creator: doc instanceof Object ? doc.fileName.toUpperCase() : '',
            variables: new Map<string, Array<Entity>>(),
            functions: new Map<string, Array<Entity>>(),
            importedFunctions: new Map<string, Array<Entity>>(),
            includes: []
            };
        
        const retn = formulation(ids, segmentation(text));
        return {
            contents: text,
            refs: retn[0],
            entities: retn[1]
        };
    }






//#region Block Formulation EntityCollection Handlers
    function processFUNCDEF(ents: Array<Entity>, tracker: IndexTracker): FunctionDefinitionEntity {
        const FUNC = ents[tracker.idx];
        const NAME = ents[tracker.idx+1];
        const header = ents.filter(p => p.line === FUNC.line);
        const args = processEntityRun(header.slice(2), tracker.ids);
        tracker.idx += header.length;
        const ending: Array<Entity> = [];
        const body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDFUNCTION') {
                    ending.push(curr);
                    tracker.idx++;
                    break;
                } else if (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'FUNCTION') {
                    ending.push(curr);
                    ending.push(ents[tracker.idx+1]);
                    tracker.idx += 2;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        if (ending.length > 1) {
            const closer = new SequenceEntity(EntityType.SEQUENCE, ending);
            return new FunctionDefinitionEntity(FUNC, NAME, args, new ContentsEntity(body), closer);
        } else {
            return new FunctionDefinitionEntity(FUNC, NAME, args, new ContentsEntity(body), ending[0]);
        }
    }

    function processIF(ents: Array<Entity>, tracker: IndexTracker): IfEntity|InlineIfEntity {
        const start = ents[tracker.idx];
        const header = ents.filter(p => p.line === start.line);
        const thenidx = header.findIndex(p => p.value.toUpperCase() === 'THEN');
        const then = header[thenidx];
        const test = processEntityRun(header.slice(1, thenidx), tracker.ids);
        const ending: Array<Entity> = [];
        tracker.idx += header.length;
        if (thenidx === -1 || thenidx === header.length - 1) { // full IF
            const body: Array<Entity|EntityCollection> = [];
            for (; tracker.idx < ents.length;) {
                const curr = ents[tracker.idx];
                const upper = curr.value.toUpperCase();
                if (blockStarters.includes(upper)) {
                    body.push(createBlockType(ents, tracker));
                } else if (curr.isComment) {
                    body.push(curr);
                    tracker.idx++;
                } else {
                    if (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF') {
                        ending.push(curr);
                        ending.push(ents[tracker.idx+1]);
                        tracker.idx += 2;
                        break;
                    } else if (upper === 'ENDIF') {
                        ending.push(curr);
                        tracker.idx++;
                        break;
                    } else {
                        body.push(createSequenceType(ents, tracker));
                    }
                }
            }
            const contents = new ContentsEntity(body);
            if (ending.length > 1) {                
                const ender = new SequenceEntity(EntityType.SEQUENCE, [ending[0], ending[1]]);
                return new IfEntity(start, test, then, contents, ender);
            } else {
                return new IfEntity(start, test, then, contents, ending[0]);
            }
        } else { // 1-liner IF (tracker.idx updated above)
            const body = new ContentsEntity(header.slice(thenidx + 1));
            return new InlineIfEntity(start, test, then, body);
        }
    }

    function processELSEIF(ents: Array<Entity>, tracker: IndexTracker): ElseIfEntity|InlineIfEntity {
        let ELSE = [ents[tracker.idx]];
        if (ents[tracker.idx].value.toUpperCase() === 'IF') {
            ELSE.push(ents[tracker.idx++]);
        }        
        const header = ents.filter(p => p.line === ELSE[0].line);        
        const thenidx = header.findIndex(p => p.value.toUpperCase() === 'THEN');
        const then = header[thenidx];
        const test = processEntityRun(header.slice(1, thenidx), tracker.ids);
        tracker.idx += header.length;
        if (thenidx === -1 || thenidx === header.length - 1) { // full ELSEIF
            const body: Array<Entity|EntityCollection> = [];
            for (; tracker.idx < ents.length;) {
                const curr = ents[tracker.idx];
                const upper = curr.value.toUpperCase();
                if (blockStarters.includes(upper)) {
                    body.push(createBlockType(ents, tracker));
                } else if (curr.isComment) {
                    body.push(curr);
                    tracker.idx++;
                } else {
                    if (upper === 'ENDIF' || (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF')) {
                        break;
                    } else {
                        body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                    }
                }
            }            
            if (ELSE.length > 1) {
                const starter = new SequenceEntity(EntityType.SEQUENCE, ELSE);
                return new ElseIfEntity(starter, test, then, new ContentsEntity(body));
            } else {
                return new ElseIfEntity(ELSE[0], test, then, new ContentsEntity(body));
            } 
        } else { // 1-liner ELSEIF
            const body = new ContentsEntity(header.slice(thenidx + 1));
            if (ELSE.length > 1) {
                const starter = new SequenceEntity(EntityType.SEQUENCE, ELSE);
                return new InlineIfEntity(starter, test, then, body);
            } else {
                return new InlineIfEntity(ELSE[0], test, then, body);
            }
        }
    }

    function processELSE(ents: Array<Entity>, tracker: IndexTracker): ElseEntity {
        const ELSE = ents[tracker.idx];                
        tracker.idx++;        
        const body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDIF' || (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF')) {                        
                    return new ElseEntity(ELSE, new ContentsEntity(body));
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            } 
        }
        // should return before this, but this will likely cover incorrect EOF edge cases
        return new ElseEntity(ELSE, new ContentsEntity(body));
    }

    function processSELECT(ents: Array<Entity>, tracker: IndexTracker): SelectEntity {
        const SELECT = ents[tracker.idx];
        const header = ents.filter(p => p.line === SELECT.line);
        const test = processEntityRun(header.slice(1), tracker.ids);
        tracker.idx += header.length;
        const ending: Array<Entity> = [];
        const body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDSELECT') {
                    ending.push(curr);
                    tracker.idx++;
                    break;
                } else if (upper === 'END' && ents[tracker.idx+1]?.value.toUpperCase() === 'SELECT') {
                    ending.push(curr);
                    ending.push(ents[tracker.idx+1]);
                    tracker.idx += 2;
                    break;                    
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }
        }
        if (ending.length > 1) {
            const closer = new SequenceEntity(EntityType.SEQUENCE, ending);
            return new SelectEntity(SELECT, test, new ContentsEntity(body), closer);
        } else {
            return new SelectEntity(SELECT, test, new ContentsEntity(body), ending[0]);
        }
    }

    function processCASE(ents: Array<Entity>, tracker: IndexTracker): CaseEntity {
        const CASE = ents[tracker.idx];
        const header = ents.filter(p => p.line === CASE.line);
        const test = processEntityRun(header.slice(1), tracker.ids);
        tracker.idx += header.length;
        const body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'CASE' || upper === 'ENDSELECT' || (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'SELECT')) {
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        return new CaseEntity(CASE, test, new ContentsEntity(body));
    }

    function processFOR(ents: Array<Entity>, tracker: IndexTracker): ForNextEntity {
        const FOR = ents[tracker.idx];        
        const header = ents.filter(p => p.line === FOR.line);
        const directive = processEntityRun(header.slice(1), tracker.ids);
        tracker.idx += header.length;
        const ending: Array<Entity> = [];
        const body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'NEXT') {                    
                    ending.push(...ents.filter(p => p.line === curr.line));
                    tracker.idx += ending.length;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        return new ForNextEntity(FOR, directive, new ContentsEntity(body), processEntityRun(ending, tracker.ids));
    }

    function processWHILE(ents: Array<Entity>, tracker: IndexTracker): WhileEntity {
        const WHILE = ents[tracker.idx];        
        const header = ents.filter(p => p.line === WHILE.line);
        const test = processEntityRun(header.slice(1), tracker.ids);
        tracker.idx += header.length;
        const ending: Array<Entity> = [];
        const body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDWHILE') {
                    ending.push(curr);
                    tracker.idx++;
                    break;
                } else if (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'WHILE') {
                    ending.push(curr);
                    ending.push(ents[tracker.idx+1]);
                    tracker.idx += 2;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        if (ending.length > 1) {
            const closer = new SequenceEntity(EntityType.SEQUENCE, ending);
            return new WhileEntity(WHILE, test, new ContentsEntity(body), closer);
        } else {
            return new WhileEntity(WHILE, test, new ContentsEntity(body), ending[0]);
        }
    }

    function processDOWHILE(ents: Array<Entity>, tracker: IndexTracker): DoWhileEntity {
        const DO = ents[tracker.idx];
        const header = ents.filter(p => p.line === DO.line);
        const DOWHILE = new SequenceEntity(EntityType.SEQUENCE, header.slice(0, 2));
        const test = processEntityRun(header.slice(2), tracker.ids);
        tracker.idx += header.length;            
        const body: Array<Entity|EntityCollection> = [];
        let curr: Entity;
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'LOOP') {
                    tracker.idx++;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        return new DoWhileEntity(DOWHILE, test, new ContentsEntity(body), curr);
    }

    function processDOUNTIL(ents: Array<Entity>, tracker: IndexTracker): DoUntilEntity {
        const DO = ents[tracker.idx];
        tracker.idx++;
        let ending: Array<Entity> = [];
        let expression: EntityCollection;
        const body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'LOOP') {
                    ending = ents.filter(p => p.line === curr.line);
                    tracker.idx += ending.length;
                    if (ending[1].value.toUpperCase() === 'UNTIL') {
                        expression = processEntityRun(ending.slice(2), tracker.ids);
                        ending = ending.slice(0,2);
                    } else {
                        expression = processEntityRun(ending.slice(1), tracker.ids);
                        ending = ending.slice(0,1);
                    }
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        return new DoUntilEntity(DO, new ContentsEntity(body), new SequenceEntity(EntityType.SEQUENCE, ending), expression);
    }
//#endregion Block Formulation EntityCollection Handlers






//#region Block Formulation Flow Control
    
    // the tracker idx increments are handled by the callers of this function. This is supposed to enhance a finite non-blocking scope that would appear on a single line.
    // This ents this function recieves could be an entire line, but it could also be the expression portion of an IF, the body portion of an InlineIf or various other "parts" of other things.
    function processEntityRun(ents: Array<Entity>, ids: NameTracker) : EntityCollection { 
        const result: Array<Entity|EntityCollection> = [];
        for (let i = 0; i < ents.length; i++) {
            const prev = ents[i-1];
            const curr = ents[i];
            const next = ents[i+1];
            const pUpper = prev ? prev.value.toUpperCase() : '';
            const upper = curr.value.toUpperCase();
            if (curr.valueType === ValueType.UNKNOWN)
            {
                if (pUpper === '.') {
                    // dotted
                    if (next?.value === '[') {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.INDEXED;
                    } else if (next?.value === '(') {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.FUNCTION;                        
                    } else {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.PROPERTY;
                    }
                } else if (next?.value === '.') {
                    if (ids.variables.has(upper)) {
                        ids.variables.get(upper).push(curr);
                        curr.valueType = ValueType.VARIABLE;
                        curr.entityType = EntityType.ENTITY;
                    } else {
                        curr.valueType = ValueType.OBJECT;
                        curr.entityType = EntityType.DOTTED;
                    }
                } else if (next?.value === '[') {
                    if (ids.variables.has(upper)) {
                        ids.variables.get(upper).push(curr);
                        curr.valueType = ValueType.VARIABLE;
                        curr.entityType = EntityType.INDEXED;
                    } else {
                        curr.valueType = ValueType.OBJECT;
                        curr.entityType = EntityType.INDEXED;
                    }
                } else if (next?.value === '(') {
                    curr.valueType = ValueType.KEYWORD;
                    curr.entityType = EntityType.FUNCTION;
                    if (ids.functions.has(upper)) {
                        ids.functions.get(upper).push(curr);
                    } else {
                        ids.functions.set(upper, [curr]);
                    }
                } else if (pUpper === 'DIM') {
                    curr.valueType = ValueType.VARIABLE;
                    curr.entityType = EntityType.ENTITY;
                } else if (pUpper === 'OBJECT') {
                    curr.valueType = ValueType.VARIABLE;
                    curr.entityType = EntityType.ENTITY;
                } else if (ids.variables.has(upper)) {
                    ids.variables.get(upper).push(curr);
                    curr.valueType = ValueType.VARIABLE;
                    curr.entityType = EntityType.ENTITY;                    
                } else if (upper === 'DIM' || upper === 'OBJECT' && next?.value !== '[') {
                    curr.valueType = ValueType.KEYWORD;
                    curr.entityType = EntityType.ENTITY;
                } else {
                    //debugger;
                }
            } else if (curr.valueType === ValueType.STRING && pUpper === 'INCLUDE') {
                // read other file and import function references
                
            } else if (pUpper === 'DIM' || pUpper === 'OBJECT') {
                curr.valueType = ValueType.ERROR;
            }
            




            // enhance this to do special work with dotted pairs, functions, varaibles, etcetera
            result.push(curr);
        }
        return new SequenceEntity(EntityType.SEQUENCE, ents);
    }


    function createBlockType(ents: Array<Entity>, tracker: IndexTracker): EntityCollection {        
        // determine what the starter type should be and return that unique collection type
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
            if (ents[tracker.idx + 1].value.toUpperCase() === 'WHILE') {
                return processDOWHILE(ents, tracker);
            } else {
                return processDOUNTIL(ents, tracker);
            }
        case 'SELECT':
            return processSELECT(ents, tracker);
        case 'CASE':
            return processCASE(ents, tracker);
        case 'FUNCTION':
            return processFUNCDEF(ents, tracker);
        default:
            return createSequenceType(ents, tracker); // should never fire, but good fallback
        }
    }


    // This is mostly handling the extraction of a lines Entities and updating the tracker. The ProcessEntityRun() handles all the details of those contents.
    function createSequenceType(ents: Array<Entity>, tracker: IndexTracker): EntityCollection {        
        const first = ents[tracker.idx];
        const content = ents.filter(p => p.line === first.line);
        tracker.idx += content.length;
        return processEntityRun(content, tracker.ids);
    }


    export function formulation(idObj: NameTracker, ents: Array<Entity>, returnAtNextBlock: boolean = false): [NameTracker, Array<Entity|EntityCollection>] {
        const result: Array<Entity|EntityCollection> = [];
        const np = path.resolve(path.relative("C:\\Users\\howar\\Music\\OtherApps\\ITMedit.Validation.Approvals\\whatever.cod", "..\\..\\Builds"));
        const tracker = { 
            idx: 0,
            ids: idObj
         };
        for (; tracker.idx < ents.length;) {
            const curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (curr.isComment === true) { // Collect Comments
                result.push(curr);
                tracker.idx++;
            } else if (blockStarters.includes(upper)) { // Process Block Types
                if (returnAtNextBlock) {
                    break;
                } else {
                    result.push(createBlockType(ents, tracker));
                }
            } else { // Process and store an insignificant Line as a single Collection
                result.push(createSequenceType(ents, tracker));
            }
        }
        return [tracker.ids, result];
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
                            temp = new Entity(EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col);
                            state = ValueType.NUMBER;
                        } else if (next1 && next1 === '.' && next2 && /\d/.test(next2)) {
                            temp = new Entity(EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col);
                            state = ValueType.NUMBER;
                        } else {
                            result.push(new Entity(EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col));
                        }
                    } else if (temp === null && curr === '.') {
                        const next1 = text[i + 1]; // If this is a # start NUMBER else log this symbol as its own DOTTED entity and stay UNKNOWN
                        if (next1 && /\d/.test(next1)) {
                            temp = new Entity(EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col);
                            state = ValueType.NUMBER;
                        } else {
                            result.push(new Entity(EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col));
                        }
                    } else if (temp === null && /\d/.test(curr)) {
                        temp = new Entity(EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col);
                        state = ValueType.NUMBER;
                    } else if (stdSymbols.includes(curr)) {
                        if (temp) {
                            result.push(enhancePrimitives(temp));
                            temp = null;
                        }
                        result.push(new Entity(EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col));
                    } else if (curr === '"') {
                        if (temp) {
                            result.push(enhancePrimitives(temp));
                            temp = null;
                        }
                        temp = new Entity(EntityType.ENTITY, ValueType.STRING, curr, lnum, col);
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
                                temp = new Entity(EntityType.ENTITY, ValueType.COMMENT, curr, lnum, col);
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
                                temp = new Entity(EntityType.ENTITY, ValueType.UNKNOWN, curr, lnum, col);
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
        const val = ent.value.toUpperCase();
        switch (val) {
            case 'NULL':
                ent.valueType = ValueType.NULL;
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
                if (FabExt.Data.flowTypes.includes(val) || FabExt.Data.specialTypes.includes(val)) {
                    ent.valueType = ValueType.KEYWORD;
                } else if (FabExt.Data.enumTypes.includes(val) || FabExt.Data.constants[val]) {
                    ent.valueType = ValueType.CONSTANT;
                }
                break;
        }
        return ent;
    }
//#endregion Primitive Segmentation Handlers


}