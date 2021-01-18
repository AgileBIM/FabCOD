import * as vscode from 'vscode';
import { 
    Entity, 
    EntityCollection, 
    ValueType, 
    CaseEntity, 
    ContentsEntity, 
    DoEntity, 
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
import { COD, NameTracker } from './document';
import { FabExt } from '../extension';

export namespace CODParser {
    interface IndexTracker {
        idx: number;  
        ids: NameTracker;
    }

    // When this document is completely done, this will be the only exported function
    export function createCOD(doc: string|vscode.TextDocument) : COD {
        // requester needs to be used to ensure that 2 COD's don't create an infinate loop by including each other as references.
        const text = doc instanceof Object ? doc.getText() : doc;
        const ids: NameTracker = new NameTracker(doc instanceof Object ? doc.fileName.toUpperCase() : '');
        const ents: Array<Entity> = segmentation(text);
        const retn = formulation(ids, ents);
        
        return {
            text: text,
            keywords: retn[0],
            contents: retn[1],
            entities: ents,            
            source: doc instanceof Object ? doc : null
        };
    }

    export function updateCOD(doc: string|vscode.TextDocument, source: COD) {
        const text = doc instanceof Object ? doc.getText() : doc;
        const ids: NameTracker = new NameTracker(doc instanceof Object ? doc.fileName.toUpperCase() : '');
        const ents = segmentation(text);
        const retn = formulation(ids, ents);
        source.text = text;
        source.keywords = retn[0];
        source.contents = retn[1];
        source.entities = ents;
        source.source = doc instanceof Object ? doc : null;
    }






//#region Block Formulation EntityCollection Handlers
    function processFUNCDEF(ents: Array<Entity>, tracker: IndexTracker): FunctionDefinitionEntity {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        if (entrun[1]?.valueType === ValueType.UNKNOWN) {
            entrun[1].valueType = ValueType.KEYWORD;
        }
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<Entity|EntityCollection> = [];
        let ender: Array<Entity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDFUNCTION') {
                    ender.push(curr);
                    tracker.idx++;
                    break;
                } else if (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'FUNCTION') {
                    ender.push(curr);
                    ender.push(ents[tracker.idx+1]);
                    tracker.idx += 2;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        const closer = new SequenceEntity(EntityType.SEQUENCE, ender);
        // const fstart = header.children.findIndex(p => p.value === 'FUNCTION');
        // const fname = header.children[fstart - 1];
        // if (fname) {
        //     if (tracker.ids.functions.has(fname.value.toUpperCase())) {
        //         tracker.ids.functions.get(fname.value.toUpperCase()).push(fname);
        //     }
        // }
        return new FunctionDefinitionEntity(header, new ContentsEntity(body), closer);
    }

    function processIF(ents: Array<Entity>, tracker: IndexTracker): IfEntity|InlineIfEntity {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        const thenidx = entrun.findIndex(p => p.value.toUpperCase() === 'THEN');
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<Entity|EntityCollection> = [];
        let ender: Array<Entity> = [];
        if (thenidx === -1 || thenidx === entrun.length - 1) { // full IF
            for (; tracker.idx < ents.length;) {
                curr = ents[tracker.idx];
                const upper = curr.value.toUpperCase();
                if (blockStarters.includes(upper)) {
                    body.push(createBlockType(ents, tracker));
                } else if (curr.isComment) {
                    body.push(curr);
                    tracker.idx++;
                } else {
                    if (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF') {
                        ender.push(curr);
                        ender.push(ents[tracker.idx+1]);
                        tracker.idx += 2;
                        break;
                    } else if (upper === 'ENDIF') {
                        ender.push(curr);
                        tracker.idx++;
                        break;
                    } else {
                        body.push(createSequenceType(ents, tracker));
                    }
                }
            }
            return new IfEntity(header, new ContentsEntity(body), new SequenceEntity(EntityType.SEQUENCE, ender));
        } else { // 1-liner IF (tracker.idx updated above)
            return new InlineIfEntity(header.children);
        }
    }

    function processELSEIF(ents: Array<Entity>, tracker: IndexTracker): ElseIfEntity|InlineIfEntity {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        const thenidx = entrun.findIndex(p => p.value.toUpperCase() === 'THEN');
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<Entity|EntityCollection> = [];
        let ender: Array<Entity> = [];
        if (thenidx === -1 || thenidx === entrun.length - 1) { // full ELSEIF
            for (; tracker.idx < ents.length;) {
                curr = ents[tracker.idx];
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
            return new ElseIfEntity(header, new ContentsEntity(body));
        } else { // 1-liner ELSEIF
            return new InlineIfEntity(header.children);
        }
    }

    function processELSE(ents: Array<Entity>, tracker: IndexTracker): ElseEntity {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDIF' || (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF')) {                        
                    return new ElseEntity(header, new ContentsEntity(body));
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            } 
        }
        // should return before this, but this will likely cover incorrect EOF edge cases
        return new ElseEntity(header, new ContentsEntity(body));
    }

    function processSELECT(ents: Array<Entity>, tracker: IndexTracker): SelectEntity {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<Entity|EntityCollection> = [];
        let ender: Array<Entity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDSELECT') {
                    ender.push(curr);
                    tracker.idx++;
                    break;
                } else if (upper === 'END' && ents[tracker.idx+1]?.value.toUpperCase() === 'SELECT') {
                    ender.push(curr);
                    ender.push(ents[tracker.idx+1]);
                    tracker.idx += 2;
                    break;                    
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }
        }
        const closer = new SequenceEntity(EntityType.SEQUENCE, ender);
        return new SelectEntity(header, new ContentsEntity(body), closer);
    }

    function processCASE(ents: Array<Entity>, tracker: IndexTracker): CaseEntity {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<Entity|EntityCollection> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
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
        return new CaseEntity(header, new ContentsEntity(body));
    }

    function processFOR(ents: Array<Entity>, tracker: IndexTracker): ForNextEntity {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<Entity|EntityCollection> = [];
        let ender: Array<Entity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'NEXT') {                    
                    ender.push(...ents.filter(p => p.line === curr.line));
                    tracker.idx += ender.length;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        return new ForNextEntity(header, new ContentsEntity(body), processEntityRun(ender, tracker.ids));
    }

    function processWHILE(ents: Array<Entity>, tracker: IndexTracker): WhileEntity {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<Entity|EntityCollection> = [];
        let ender: Array<Entity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (blockStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDWHILE') {
                    ender.push(curr);
                    tracker.idx++;
                    break;
                } else if (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'WHILE') {
                    ender.push(curr);
                    ender.push(ents[tracker.idx+1]);
                    tracker.idx += 2;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        const closer = new SequenceEntity(EntityType.SEQUENCE, ender);
        return new WhileEntity(header, new ContentsEntity(body), closer);
    }

    function processDO(ents: Array<Entity>, tracker: IndexTracker): DoEntity {
        let curr: Entity = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        const header = processEntityRun(entrun, tracker.ids);
        tracker.idx += entrun.length;
        const body: Array<Entity|EntityCollection> = [];
        let footer: EntityCollection;
        if (curr.value.toUpperCase() === 'WHILE') {
            body.push(curr);
            tracker.idx++;
        }
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
                    entrun = ents.filter(p => p.line === curr.line);
                    footer = processEntityRun(entrun, tracker.ids);
                    tracker.idx += entrun.length;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this will make line collections if it isn't a block starter
                }
            }            
        }
        return new DoEntity(header, new ContentsEntity(body), footer);
    }
//#endregion Block Formulation EntityCollection Handlers






//#region Block Formulation Flow Control
    
    // the tracker idx increments are handled by the callers of this function. This is supposed to enhance a finite non-blocking scope that would appear on a single line.
    // This ents this function recieves could be an entire line, but it could also be the expression portion of an IF, the body portion of an InlineIf or various other "parts" of other things.
    function processEntityRun(ents: Array<Entity>, ids: NameTracker, assumeVariables?: boolean) : EntityCollection { 
        const result: Array<Entity|EntityCollection> = [];
        for (let i = 0; i < ents.length; i++) {
            const prev = ents[i - 1];
            const curr = ents[i];
            const next = ents[i + 1];
            const pUpper = prev ? prev.value.toUpperCase() : '';
            const upper = curr.value.toUpperCase();
            if (curr.valueType === ValueType.UNKNOWN || upper === 'DIM' || pUpper === 'FUNCTION')
            {
                const nAttach = !next ? false : curr.column + curr.value.length === next.column;
                const pAttach = !prev ? false : prev.column + prev.value.length === curr.column;
                if (pAttach && pUpper === '.') {
                    // dotted
                    if (nAttach && next.value === '[') {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.INDEXED;
                    } else if (nAttach && next.value === '(') {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.METHOD;                        
                    } else {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.PROPERTY;
                    }
                } else if (nAttach && next.value === '.') {
                    if (ids.variables.has(upper)) {
                        ids.variables.get(upper).push(curr);
                        curr.valueType = ValueType.VARIABLE;
                        curr.entityType = EntityType.ENTITY;
                    } else {
                        curr.valueType = ValueType.OBJECT;
                        curr.entityType = EntityType.DOTTED;
                    }
                } else if (nAttach && next.value === '[') {
                    if (ids.variables.has(upper)) {
                        ids.variables.get(upper).push(curr);
                        curr.valueType = ValueType.VARIABLE;
                        curr.entityType = EntityType.INDEXED;
                    } else {
                        curr.valueType = ValueType.OBJECT;
                        curr.entityType = EntityType.INDEXED;
                    }
                } else if (pUpper === 'FUNCTION' && next.value === '(') {
                    curr.valueType = ValueType.KEYWORD;
                    curr.entityType = EntityType.FUNCTION;
                    if (ids.functions.has(upper)) {
                        ids.functions.get(upper).push(curr);
                    } else {
                        ids.functions.set(upper, [curr]);
                    }
                } else if (nAttach && next.value === '(') {
                    curr.valueType = ValueType.KEYWORD;
                    curr.entityType = EntityType.FUNCTION;
                    if (!FabExt.Data.functions[upper]) {
                        if (ids.functions.has(upper)) {
                            ids.functions.get(upper).push(curr);
                        } else {
                            ids.functions.set(upper, [curr]);
                        }
                    }
                } else if (pUpper === 'DIM' || pUpper === 'OBJECT' || (assumeVariables && pUpper !== "FUNCTION")) {
                    curr.valueType = ValueType.VARIABLE;
                    curr.entityType = EntityType.ENTITY;
                    if (ids.variables.has(upper)) {
                        ids.variables.get(upper).push(curr);
                    } else {
                        ids.variables.set(upper, [curr]);
                    }
                } else if (ids.variables.has(upper)) {
                    ids.variables.get(upper).push(curr);
                    curr.valueType = ValueType.VARIABLE;
                    curr.entityType = EntityType.ENTITY;                    
                } else if (upper === 'DIM' || upper === 'OBJECT' && next?.value !== '[') {
                    curr.valueType = ValueType.KEYWORD;
                    curr.entityType = EntityType.ENTITY;
                } else if (pUpper === ',' && ents[i-2]?.valueType === ValueType.VARIABLE) {
                    curr.valueType = ValueType.VARIABLE;
                    curr.entityType = EntityType.ENTITY;    
                    if (ids.variables.has(upper)) {
                        ids.variables.get(upper).push(curr);
                    } else {
                        ids.variables.set(upper, [curr]);
                    }
                } else {
                    ids.skipped.push(curr);
                }
            } else if (curr.isString && pUpper === 'INCLUDE') {
                ids.includes.push(upper.replace(/\"/g, ''));
            }
            // This COULD be enhanced to make EntityCollections of dotted pairs, functions with variables, varaible declarations and assignments, etcetera
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
            if (ents[tracker.idx + 1].value.toUpperCase() === 'IF' && ents[tracker.idx].line === ents[tracker.idx + 1].line) {
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


    export function formulation(idObj: NameTracker, ents: Array<Entity>): [NameTracker, Array<Entity|EntityCollection>] {
        const result: Array<Entity|EntityCollection> = [];
        //const np = path.resolve(path.relative("C:\\Users\\howar\\Music\\OtherApps\\ITMedit.Validation.Approvals\\whatever.cod", "..\\..\\Builds"));
        const tracker: IndexTracker = { 
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
                result.push(createBlockType(ents, tracker));
            } else { // Process and store an insignificant Line as a single Collection
                result.push(createSequenceType(ents, tracker));
            }
        }
        const removes: number[] = [];
        tracker.ids.skipped.forEach((ent, i) => {
            if (tracker.ids.variables.has(ent.value.toUpperCase())) {
                tracker.ids.variables.get(ent.value.toUpperCase()).push(ent);
                removes.push(i);
            } else if (tracker.ids.functions.has(ent.value.toUpperCase())) {
                tracker.ids.functions.get(ent.value.toUpperCase()).push(ent);
                removes.push(i);
            }
        });
        if (removes.length >= 1) {
            tracker.ids.skipped = tracker.ids.skipped.filter((obj, i) => !removes.includes(i));
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
                            temp = new Entity(EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col, result.length);
                            state = ValueType.NUMBER;
                        } else if (next1 && next1 === '.' && next2 && /\d/.test(next2)) {
                            temp = new Entity(EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col, result.length);
                            state = ValueType.NUMBER;
                        } else {
                            result.push(new Entity(EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col, result.length));
                        }
                    } else if (temp === null && /\d/.test(curr)) {
                        temp = new Entity(EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col, result.length);
                        state = ValueType.NUMBER;
                    } else if (curr === '.') {
                        const next1 = text[i + 1]; // If this is a # start NUMBER else log this symbol as its own DOTTED entity and stay UNKNOWN
                        if (next1 && /\d/.test(next1)) {
                            temp = new Entity(EntityType.ENTITY, ValueType.NUMBER, curr, lnum, col, result.length);
                            state = ValueType.NUMBER;
                        } else {
                            if (temp) {
                                result.push(enhancePrimitives(temp, result[result.length -1]));
                                temp = null;
                            }
                            result.push(new Entity(EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col, result.length));
                        }
                    } else if (stdSymbols.includes(curr)) {
                        if (temp) {
                            result.push(enhancePrimitives(temp, result[result.length -1]));
                            temp = null;
                        }
                        result.push(new Entity(EntityType.ENTITY, ValueType.SYMBOL, curr, lnum, col, result.length));
                    } else if (curr === '"') {
                        if (temp) {
                            result.push(enhancePrimitives(temp, result[result.length -1]));
                            temp = null;
                        }
                        temp = new Entity(EntityType.ENTITY, ValueType.STRING, curr, lnum, col, result.length);
                        state = ValueType.STRING;
                    } else {
                        let handled = false;
                        if (curr.toUpperCase() === 'R') {
                            const next1 = text[i + 1];
                            const next2 = text[i + 2];
                            const next3 = text[i + 3];
                            const combo = (next1 && next2) ? (curr + next1 + next2) : '';
                            if (combo === 'REM' && (next3 === ' ' || next3 === '\t')) {
                                if (temp) {
                                    result.push(enhancePrimitives(temp, result[result.length -1]));
                                    temp = null;
                                }
                                temp = new Entity(EntityType.ENTITY, ValueType.COMMENT, curr, lnum, col, result.length);
                                state = ValueType.COMMENT;
                                handled = true;
                            }
                        }
                        if (!handled) {
                            if (/\s/.test(curr)){
                                if (temp) {
                                    result.push(enhancePrimitives(temp, result[result.length -1]));
                                    temp = null;
                                }
                            } else if (temp) {
                                temp.value += curr;
                            } else {
                                temp = new Entity(EntityType.ENTITY, ValueType.UNKNOWN, curr, lnum, col, result.length);
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
            result.push(enhancePrimitives(temp, result[result.length -1]));
        }
        return result;
    } // End tokenize()


    function enhancePrimitives(ent: Entity, prev: Entity) {        
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
                if (prev && prev.value !== '.') {
                    if (FabExt.Data.flowTypes.includes(val) || FabExt.Data.specialTypes.includes(val)) {
                        ent.valueType = ValueType.KEYWORD;
                    } else if (FabExt.Data.enumTypes.includes(val) || FabExt.Data.constants[val]) {
                        ent.valueType = ValueType.CONSTANT;
                    } else if (FabExt.Data.objects[val]) {
                        ent.valueType = ValueType.OBJECT;
                    }
                }
                break;
        }
        return ent;
    }
//#endregion Primitive Segmentation Handlers


}