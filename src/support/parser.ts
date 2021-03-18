import * as fs from 'fs-extra';
import * as nodepath from 'path';
import * as vscode from 'vscode';
import { 
    Entity, 
    EntityCollection, 
    ValueType, 
    EntityType, 
    stdSymbols,
    foldStarters,
    IEntity,
    IContentCollection,
    ImportedEntity
 } from "./entities";
import { COD, NameTracker } from './document';
import { FabExt } from '../extension';

export namespace CODParser {
    interface IndexTracker {
        idx: number;  
        ids: NameTracker;
    }

    // When this document is completely done, this will be the only exported function
    export function createOrUpdateCOD(doc: string|vscode.TextDocument, existing?: COD) : COD|void {
        // requester needs to be used to ensure that 2 COD's don't create an infinate loop by including each other as references.
        const text = doc instanceof Object ? doc.getText() : doc;
        const ids: NameTracker = new NameTracker(doc instanceof Object ? doc.fileName.toUpperCase() : '');
        const ents: Array<Entity> = segmentation(text) ?? [];
        const retn = formulation(ids, ents) ?? ents;

        // collect data from IMPORT references
        if (ids.includes.length >= 1) {
            ids.includes.forEach(fullPath => { 
                if (fs.pathExistsSync(fullPath) === false) {
                    const join = fullPath.split('/');
                    fullPath = nodepath.join(nodepath.dirname(ids.creator), ...(join ? join : ['.']));
                }            
                const parent = FabExt.Documents?.getDocument(fullPath);
                if (parent) {
                    const pKeys = [...parent.keywords.functions.keys()];
                    pKeys.forEach(key => {
                        const imports = parent.keywords.functions.get(key);
                        if (ids.importedFunctions.has(key) === false) {
                            ids.importedFunctions.set(key, []);
                        }
                        imports.forEach(fEnt => {
                            const impEntity = new ImportedEntity(fEnt, fullPath);
                            ids.importedFunctions.get(key).push(impEntity);
                        });
                    });
                }
            });
        }

        // Update or return qualified COD
        if (existing) {
            existing.text = text;
            existing.keywords = ids;
            existing.contents = retn;
            existing.entities = ents;
            existing.source = doc instanceof Object ? doc : null;
        } else {
            return {
                text: text,
                keywords: ids,
                contents: retn,
                entities: ents,            
                source: doc instanceof Object ? doc : null
            };    
        }
    }


// kind of wondering if all the things previously building the SEQUENCE type should be going through processEntityRun()
//#region Block Formulation EntityCollection Handlers
    function createFuncDefinition(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        if (entrun[1]?.valueType === ValueType.UNKNOWN) {
            entrun[1].valueType = ValueType.KEYWORD;
        }
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<IEntity> = [];
        let ender: Array<IEntity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (foldStarters.includes(upper)) {
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
                    body.push(createSequenceType(ents, tracker)); // this makes line collections when it wasn't a block starter
                }
            }            
        }
        return new EntityCollection(EntityType.FUNCTIONDEF, header, body, ender);
    }


    function createIfStatement(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        const thenidx = entrun.findIndex(p => p.value.toUpperCase() === 'THEN');
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<IEntity> = [];
        let ender: Array<IEntity> = [];
        if (thenidx === -1 || thenidx === entrun.length - 1) { // full IF
            for (; tracker.idx < ents.length;) {
                curr = ents[tracker.idx];
                const upper = curr.value.toUpperCase();
                if (foldStarters.includes(upper)) {
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
            return new EntityCollection(EntityType.IF, header, body, ender);
        } else { // 1-liner IF (tracker.idx updated above)
            return new EntityCollection(EntityType.IFINLINE, header);
        }
    }

    function createElseIfStatement(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        const thenidx = entrun.findIndex(p => p.value.toUpperCase() === 'THEN');
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<IEntity> = [];
        let ender: Array<IEntity> = [];
        if (thenidx === -1 || thenidx === entrun.length - 1) { // full ELSEIF
            for (; tracker.idx < ents.length;) {
                curr = ents[tracker.idx];
                const upper = curr.value.toUpperCase();
                if (foldStarters.includes(upper)) {
                    body.push(createBlockType(ents, tracker));
                } else if (curr.isComment) {
                    body.push(curr);
                    tracker.idx++;
                } else {
                    if (upper === 'ENDIF' || (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF')) {
                        break;
                    } else {
                        body.push(createSequenceType(ents, tracker)); // this makes line collections when it wasn't a block starter
                    }
                }
            }
            return new EntityCollection(EntityType.ELSEIF, header, body);
        } else { // 1-liner ELSEIF
            return new EntityCollection(EntityType.IFINLINE, header);
        }
    }

    function processElseStatement(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<IEntity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (foldStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'ENDIF' || (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'IF')) {                        
                    return new EntityCollection(EntityType.ELSE, header, body);
                } else {
                    body.push(createSequenceType(ents, tracker)); // this makes line collections when it wasn't a block starter
                }
            } 
        }
        // should return before this, but this will likely cover incorrect EOF edge cases
        return new EntityCollection(EntityType.ELSE, header, body);
    }

    function processSelectStatement(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<IEntity> = [];
        let ender: Array<IEntity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (foldStarters.includes(upper)) {
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
                    body.push(createSequenceType(ents, tracker)); // this makes line collections when it wasn't a block starter
                }
            }
        }
        return new EntityCollection(EntityType.SELECT, header, body, ender);
    }

    function processCaseStatement(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<IEntity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (foldStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'CASE' || upper === 'ENDSELECT' || (upper === 'END' && ents[tracker.idx+1].value.toUpperCase() === 'SELECT')) {
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this makes line collections when it wasn't a block starter
                }
            }            
        }
        return new EntityCollection(EntityType.CASE, header, body);
    }

    function processForStatement(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<IEntity> = [];
        let ender: Array<IEntity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (foldStarters.includes(upper)) {
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
                    body.push(createSequenceType(ents, tracker)); // this makes line collections when it wasn't a block starter
                }
            }            
        }
        return new EntityCollection(EntityType.FOR, header, body, processEntityRun(ender, tracker.ids));
    }

    function processWhileStatement(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        let header = processEntityRun(entrun, tracker.ids, true);
        tracker.idx += entrun.length;        
        let body: Array<IEntity> = [];
        let ender: Array<IEntity> = [];
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (foldStarters.includes(upper)) {
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
                    body.push(createSequenceType(ents, tracker)); // this makes line collections when it wasn't a block starter
                }
            }            
        }
        return new EntityCollection(EntityType.WHILE, header, body, ender);
    }

    function processDoStatement(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {
        let curr: Entity = ents[tracker.idx];        
        let entrun = ents.filter(p => p.line === curr.line);
        const header = processEntityRun(entrun, tracker.ids);
        tracker.idx += entrun.length;
        const body: Array<IEntity> = [];
        if (curr.value.toUpperCase() === 'WHILE') {
            body.push(curr);
            tracker.idx++;
        }
        for (; tracker.idx < ents.length;) {
            curr = ents[tracker.idx];
            const upper = curr.value.toUpperCase();
            if (foldStarters.includes(upper)) {
                body.push(createBlockType(ents, tracker));
            } else if (curr.isComment) {
                body.push(curr);
                tracker.idx++;
            } else {
                if (upper === 'LOOP') {
                    entrun = ents.filter(p => p.line === curr.line);
                    tracker.idx += entrun.length;
                    break;
                } else {
                    body.push(createSequenceType(ents, tracker)); // this makes line collections when it wasn't a block starter
                }
            }            
        }
        return new EntityCollection(EntityType.DO, header, body, processEntityRun(entrun, tracker.ids));
    }
//#endregion Block Formulation EntityCollection Handlers






//#region Block Formulation Flow Control
    
    // the tracker idx increments are handled by the callers of this function. This is supposed to enhance a finite non-blocking scope that would appear on a single line.
    // This ents this function recieves could be an entire line, but it could also be the expression portion of an IF, the body portion of an InlineIf or various other "parts" of other things.
    function processEntityRun(ents: Array<Entity>, ids: NameTracker, assumeVariables?: boolean) : Array<IEntity> { 
        const result: Array<Entity|EntityCollection> = [];
        for (let i = 0; i < ents.length; i++) {
            const prev = ents[i - 1];
            const curr = ents[i];
            const next = ents[i + 1];
            // if (prev.value === undefined) debugger;
            // if (curr.value === undefined) debugger;
            // if (next.value === undefined) debugger;
            const pUpper = prev?.value ? prev.value.toUpperCase() : '';
            const upper = curr.value.toUpperCase();
            if (curr.valueType === ValueType.UNKNOWN || upper === 'DIM' || pUpper === 'FUNCTION')
            {
                const nAttach = !next ? false : curr.column + curr.value.length === next.column;
                const pAttach = !prev ? false : prev.column + prev.value.length === curr.column;
                if (pAttach && pUpper === '.') {
                    // dotted
                    if (nAttach && next?.value === '[') {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.INDEXED;
                    } else if (nAttach && next?.value === '(') {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.METHOD;                        
                    } else {
                        curr.valueType = ValueType.KEYWORD;
                        curr.entityType = EntityType.PROPERTY;
                    }
                } else if (nAttach && next?.value === '.') {
                    if (ids.variables.has(upper)) {
                        ids.variables.get(upper).push(curr);
                        curr.valueType = ValueType.VARIABLE;
                        curr.entityType = EntityType.ENTITY;
                    } else {
                        curr.valueType = ValueType.OBJECT;
                        curr.entityType = EntityType.DOTTED;
                    }
                } else if (nAttach && next?.value === '[') {
                    if (ids.variables.has(upper)) {
                        ids.variables.get(upper).push(curr);
                        curr.valueType = ValueType.VARIABLE;
                        curr.entityType = EntityType.INDEXED;
                    } else {
                        curr.valueType = ValueType.OBJECT;
                        curr.entityType = EntityType.INDEXED;
                    }
                } else if (pUpper === 'FUNCTION' && next?.value === '(') {
                    curr.valueType = ValueType.KEYWORD;
                    curr.entityType = EntityType.FUNCTION;
                    if (ids.functions.has(upper)) {
                        ids.functions.get(upper).push(curr);
                    } else {
                        ids.functions.set(upper, [curr]);
                    }
                } else if (nAttach && next?.value === '(') {
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
        return ents;
    }


    // This is mostly handling the extraction of a lines Entities and updating the tracker. The ProcessEntityRun() handles all the details of those contents.
    function createSequenceType(ents: Array<Entity>, tracker: IndexTracker): EntityCollection {        
        const first = ents[tracker.idx];
        const content = ents.filter(p => p.line === first.line);
        tracker.idx += content.length;
        return new EntityCollection(EntityType.SEQUENCE, processEntityRun(content, tracker.ids));
    }


    function createBlockType(ents: Array<Entity>, tracker: IndexTracker): IContentCollection {        
        // determine what the starter type should be and return that unique collection type
        const target = ents[tracker.idx].value.toUpperCase();
        switch (target) {
        case 'IF':
            return createIfStatement(ents, tracker);
        case 'ELSEIF':
            return createElseIfStatement(ents, tracker);
        case 'ELSE':
            if (ents[tracker.idx + 1].value.toUpperCase() === 'IF' && ents[tracker.idx].line === ents[tracker.idx + 1].line) {
                return createElseIfStatement(ents, tracker);
            } else {
                return processElseStatement(ents, tracker);
            }
        case 'FOR':
            return processForStatement(ents, tracker);
        case 'WHILE':
            return processWhileStatement(ents, tracker);
        case 'DO':
            return processDoStatement(ents, tracker);
        case 'SELECT':
            return processSelectStatement(ents, tracker);
        case 'CASE':
            return processCaseStatement(ents, tracker);
        case 'FUNCTION':
            return createFuncDefinition(ents, tracker);
        default:
            return createSequenceType(ents, tracker); // should never fire, but good fallback
        }
    }
    


    export function formulation(idObj: NameTracker, ents: Array<Entity>): Array<IEntity> {
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
            } else if (foldStarters.includes(upper)) { // Process Block Types
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