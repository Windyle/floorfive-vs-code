import * as vscode from 'vscode';

export class Store {

    public static get rootPath(): string {
        if (vscode.workspace.workspaceFolders) {
            return vscode.workspace.workspaceFolders[0].uri.fsPath;
        }

        return ``;
    }

    public static mainViewWebview: vscode.Webview | undefined;
    public static panelViewWebview: vscode.Webview | undefined;

    public static icons = [
        `arrows-right-left`,
        `book`,
        `check-circle`,
        `chevron-left`,
        `chevron-right`,
        `copy`,
        `download-cloud`,
        `external-link`,
        `eye`,
        `loader`,
        `package`,
        `play`,
        `search`,
        `settings`,
        `square`,
        `upload-cloud`,
        `x-circle`
    ];

    public static terminalColorsCssVars = [
        `--vscode-terminal-ansiBlack`,
        `--vscode-terminal-ansiRed`,
        `--vscode-terminal-ansiGreen`,
        `--vscode-terminal-ansiYellow`,
        `--vscode-terminal-ansiBlue`,
        `--vscode-terminal-ansiMagenta`,
        `--vscode-terminal-ansiCyan`,
        `--vscode-terminal-ansiWhite`,
    ];
}