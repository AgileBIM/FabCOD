import * as vscode from "vscode";
import * as Resources from "./resources";
import { FabExt } from './extension';
//import * as fs from	'fs-extra';
import { FabDocument } from "./support/document";
import { COD } from './support/parser';

export interface DocumentSources {

}


export class FabDocumentManager{	
	private _cached: Map<string, COD> = new Map();
	private _watchers: vscode.FileSystemWatcher[] = [];
	
	get WorkspaceDocuments(): FabDocument[] { 
		return this.getWorkspaceDocuments(); 
	}
	// get ActiveDocument(): ReadonlyDocument { 
	// 	if (vscode.window.activeTextEditor) {
	// 		const key = this.documentConsumeOrValidate(vscode.window.activeTextEditor.document, Origins.OPENED);			
	// 		return this._cached.get(key)?.internal;
	// 	} else {
	// 		return null;
	// 	}		
	// }
	
	get ActiveTextDocument(): vscode.TextDocument|undefined { 
		return vscode.window.activeTextEditor?.document;
	}

	private get cacheKeys(): string [] {
		return [...this._cached.keys()];
	}

	// General purpose methods for identifying the scope of work for a given document type
	isValidCOD(fspath: string): boolean { 
		return FabDocumentManager.isValidCOD(fspath); 
	}
	public static isValidCOD(fspath: string): boolean {
		if (fspath) {
			return fspath.toUpperCase().slice(-4) === ".COD";
		} else {
			return false;
		}
	}

	private normalizePath(path: string): string {
		return path.replace(/\//g, '\\');
	}

	private tryUpdateInternal(sources: DocumentSources){
		// if (sources.native && (!sources.internal || !sources.internal.equal(sources.native))) {
		// 	sources.internal = ReadonlyDocument.getMemoryDocument(sources.native);
		// }
	}

	private pathConsumeOrValidate(path: string): string {
		// const key = this.normalizePath(path);		
		// if (fs.existsSync(key) && this.getSelectorType(key) === DocumentManager.Selectors.lsp) {
		// 	if (this._cached.has(key) === false) {
		// 		const sources = DocumentSources.create(flag, ReadonlyDocument.open(key));
		// 		this._cached.set(key, sources);
		// 	} else {
		// 		const sources = this._cached.get(key);				
		// 		this.tryUpdateInternal(sources);
		// 		sources.flags.add(flag);
		// 	}
		// 	return key;
		// } else {
		// 	return '';
		// }
		return path;
	}

	private documentConsumeOrValidate(doc: vscode.TextDocument, key?: string): string {
		// if (!key){
		// 	key = this.normalizePath(doc.fileName);
		// }
		// if (this.getSelectorType(key) === DocumentManager.Selectors.lsp){
		// 	if (this._cached.has(key) === false) {
		// 		const sources = DocumentSources.create(flag, doc);
		// 		this._cached.set(key, sources);
		// 	} else {
		// 		const sources = this._cached.get(key);
		// 		sources.native = doc;
		// 		this.tryUpdateInternal(sources);
		// 		sources.flags.add(flag);
		// 	}
		// 	return key;
		// } else {
		// 	return '';
		// }
		return key ? key : '';
	}

	getDocument(nDoc: vscode.TextDocument): FabDocument|null {
		// const key = this.documentConsumeOrValidate(nDoc, Origins.OPENED);					
		// return this._cached.get(key)?.internal;
		return null;
	}	


	// Gets a complete ReadonlyDocuments representing the workspace, but will update cached internal versions if it is out of sync with an available vscode.TextDocument
	private getWorkspaceDocuments(): FabDocument[] {
		const result: FabDocument[] = [];
		// this.cacheKeys.forEach(key => {
		// 	const sources = this._cached.get(key);
		// 	if (sources.flags.has(Origins.WSPACE)) {
		// 		this.tryUpdateInternal(sources);
		// 		if (!sources.internal) {
		// 			sources.internal = ReadonlyDocument.open(key);
		// 		}
		// 		result.push(sources.internal);
		// 	}
		// });
		return result;
	}

	// Creates the FileSystemWatcher's & builds a workspace blueprint
	private initialize(): void {
		this._watchers.forEach(w => {
			w.dispose();
		});
		this._watchers.length = 0;

		// Grab the opened document (if available) and add it as our first known opened document
		//		It is important to start tracking this early because we can't actually see what is opened by VSCode during its internal workspace reload.
		//		Our first opportunity to capture these previously opened documents is when they are activated. **Unavoidable Technical Debt that needs future resolution**
		if (vscode.window.activeTextEditor && this.isValidCOD(vscode.window.activeTextEditor.document.fileName)) {
			this.documentConsumeOrValidate(vscode.window.activeTextEditor.document);
		}

		// This builds the '_workspace' *.LSP Memory Document placeholder set
		// 		This feature does make the "fair assumption" that AutoCAD machines have plenty of memory to be holding all this information
		// 		The impact of creating read-only documents was stress tested with a root workspace folder containing 10mb of *.LSP files
		//		and the memory footprint from just the ReadonlyDocument's increased the memory (sustained) by less than 50mb		
		vscode.workspace.findFiles("**").then((items: vscode.Uri[]) => {
			items.forEach((fileUri: vscode.Uri) => {	
				this.pathConsumeOrValidate(fileUri.fsPath);
			});
		});
		
		if (vscode.workspace.workspaceFolders) {
			this.setupFileSystemWatchers();
		}
	}

	// integral to the initialize() function but separated for clarity
	private setupFileSystemWatchers(): void {
		vscode.workspace.workspaceFolders?.forEach(folder => {
			const pattern = new vscode.RelativePattern(folder, "**");
			const watcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);

			FabExt.Subscriptions?.push(watcher.onDidDelete((e: vscode.Uri) => {
				const key = this.normalizePath(e.fsPath);
				if (this._cached.has(key)){
					this._cached.delete(key);
				}
			}));
		
	
			FabExt.Subscriptions?.push(watcher.onDidCreate((e: vscode.Uri) => {
				const key = this.normalizePath(e.fsPath);
				this.pathConsumeOrValidate(key);
			}));
	
			FabExt.Subscriptions?.push(watcher.onDidChange((e: vscode.Uri) => {
				const key = this.normalizePath(e.fsPath);
				this.pathConsumeOrValidate(key);				
			}));

			this._watchers.push(watcher);
		});
	}

	constructor() {
		// Create FileSystemWatcher's & build the workspace blueprint
		this.initialize();

		FabExt.Subscriptions?.push(vscode.workspace.onDidCloseTextDocument((e: vscode.TextDocument) => {
			// probably update the RO file?
		}));
	
		FabExt.Subscriptions?.push(vscode.workspace.onDidOpenTextDocument((e: vscode.TextDocument) => {
			this.documentConsumeOrValidate(e);
		}));

		// Note: if the file is already opened and deleted through the workspace, it is deleted AND closed.
		FabExt.Subscriptions?.push(vscode.workspace.onDidDeleteFiles((e: vscode.FileDeleteEvent) => {
			e.files.forEach(file => {
				const key = this.normalizePath(file.fsPath);
				if (this._cached.has(key)) {
					this._cached.delete(key);
				}
			});
		}));
	} // End of DocumentManger Constructor
}


// This is a singleton class
export class FabContextManager {
	private _ctx: vscode.ExtensionContext|undefined;
	private _docManager: FabDocumentManager|undefined;

	get Context(): vscode.ExtensionContext|undefined { 
		return this._ctx; 
	}
	get Documents(): FabDocumentManager|undefined { 
		return this._docManager; 
	}
	get selector(): string[] { 
		return ['codscript'];
	}
	get Subscriptions(): vscode.Disposable[]|undefined { 
		return this._ctx?.subscriptions; 
	}
	get ExtPath(): string { 
		return this._ctx ? this._ctx.extensionPath : ""; 
	}
	get Data() { 
		return Resources; 
	}

	
	initialize(context: vscode.ExtensionContext): void {
		this._ctx = context;
		this._docManager = new FabDocumentManager();
	}
}