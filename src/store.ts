import * as vscode from 'vscode';

export class Store {

    public static get rootPath(): string {
        if (vscode.workspace.workspaceFolders) {
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        }

        return '';
    }
}