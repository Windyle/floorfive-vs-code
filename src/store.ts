import * as vscode from "vscode";

export class Store {

    public static get rootPath(): string {
        if (vscode.workspace.workspaceFolders) {
            return vscode.workspace.workspaceFolders[0].uri.fsPath.replace(/\\/g, "/");
        }

        return "";
    }

    public static extensionContext: vscode.ExtensionContext | undefined;

    public static mainViewWebview: vscode.Webview | undefined;
    public static mainViewWebviewContext: vscode.ExtensionContext | undefined;
    public static panelViewWebview: vscode.Webview | undefined;
    public static panelViewWebviewContext: vscode.ExtensionContext | undefined;

    public static terminalColorsCssVars = [
        "--vscode-terminal-ansiBlack",
        "--vscode-terminal-ansiRed",
        "--vscode-terminal-ansiGreen",
        "--vscode-terminal-ansiYellow",
        "--vscode-terminal-ansiBlue",
        "--vscode-terminal-ansiMagenta",
        "--vscode-terminal-ansiCyan",
        "--vscode-terminal-ansiWhite",
    ];
}