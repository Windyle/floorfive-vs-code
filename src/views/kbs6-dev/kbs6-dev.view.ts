import * as vscode from 'vscode';
import { HTML } from './kbs6-dev.view.html';
import { CSS } from './kbs6-dev.view.css';

// View class
export class Kbs6DevView {

    private static readonly viewType = 'floorfive-vs-code.kbs6-dev';

    public static activate = (context: vscode.ExtensionContext) => {
        // Create a new webview panel
        const panel = vscode.window.registerWebviewViewProvider(Kbs6DevView.viewType, new Kbs6DevViewProvider(context));
    };

}

// View provider class
class Kbs6DevViewProvider implements vscode.WebviewViewProvider {

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {

        // Set the webview's initial html content
        webviewView.webview.html = HTML.replace(`{{css}}`, CSS);

        webviewView.webview.options = {
            enableScripts: true
        };

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            undefined,
            this.context.subscriptions
        );
    }
}