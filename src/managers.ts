import * as vscode from "vscode";
import { library } from "./resources";
import { FabExt } from './extension';
import * as fs from	'fs-extra';
import { CODParser } from './support/parser';
import { COD } from "./support/document";



export class FabDocumentManager{	
	private _cached: Map<string, COD> = new Map();
	private _watchers: vscode.FileSystemWatcher[] = [];
	
	get WorkspaceDocuments(): COD[] {
		return [...this._cached.values()];
	}
	get ActiveDocument(): COD { 
		if (vscode.window.activeTextEditor) {
			const key = this.documentConsumeOrValidate(vscode.window.activeTextEditor.document);			
			return this._cached.get(key);
		} else {
			return null;
		}		
	}
	
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
		return path.replace(/\//g, '\\').toUpperCase();
	}

	private tryUpdateInternal(cod: COD, doc: vscode.TextDocument): void {		
		if (cod?.text !== doc?.getText()) {
			CODParser.updateCOD(doc, cod);			
		}
	}

	private pathConsumeOrValidate(path: string): string {
		const key = this.normalizePath(path);		
		if (fs.existsSync(key) && this.isValidCOD(key)) {
			if (this._cached.has(key) === false) {
				try {
					const text = fs.readFileSync(path).toString();
					const cod = CODParser.createCOD(text);
					this._cached.set(key, cod);	
				} catch (error) {
					debugger;
				}
			} else {
				try {
					const cod = this._cached.get(key);			
					this.tryUpdateInternal(cod, cod.source);	
				} catch (error) {
					debugger;
				}
				
			}
			return key;
		} else {
			return '';
		}
	}

	private documentConsumeOrValidate(doc: vscode.TextDocument, key?: string): string {
		if (!key){
			try {
				key = this.normalizePath(doc.fileName);	
			} catch (error) {
				debugger;
			}
		}
		if (this.isValidCOD(key)) {
			if (this._cached.has(key) === false) {
				try {
					const sources = CODParser.createCOD(doc);
					this._cached.set(key, sources);
				} catch (error) {
					debugger;
				}
			} else {
				this.tryUpdateInternal(this._cached.get(key), doc);
			}
			return key;
		} else {
			return '';
		}
	}

	getDocument(nDoc: vscode.TextDocument, tryUpdate: boolean = true): COD {
		let key: string = '';
		try {
			key = this.normalizePath(nDoc.fileName);	
		} catch (error) {
			debugger;
		}
		if (tryUpdate || !this._cached.has(key)) {
			key = this.documentConsumeOrValidate(nDoc);
		} 
		return this._cached.get(key);
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

		vscode.workspace.findFiles("**").then((items: vscode.Uri[]) => {
			items.forEach((fileUri: vscode.Uri) => {	
				try {
					this.pathConsumeOrValidate(fileUri.fsPath);	
				} catch (error) { debugger;}
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

		FabExt.Subscriptions?.push(vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {
			this.documentConsumeOrValidate(e);
		}));

		FabExt.Subscriptions?.push(vscode.workspace.onDidCloseTextDocument((e: vscode.TextDocument) => {
			this.documentConsumeOrValidate(e);
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
		return library; 
	}

	
	initialize(context: vscode.ExtensionContext): void {
		this._ctx = context;
		this._docManager = new FabDocumentManager();
	}
}