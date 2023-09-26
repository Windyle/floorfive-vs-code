import * as vscode from 'vscode';
import * as fs from 'node:fs';
import { FFConsole } from '../../services/console.service';
import { IconsService } from '../../services/icons.service';
import { ANIMATIONS_CSS } from '../_animations';
import { CSS } from './panel.view.css';
import { HTML } from './panel.view.html';
import { Modules } from '../../modules/modules.index';
import { PanelViewScript } from './panel.view.script';
import { Store } from '../../store';

// View class
export class PanelView {

    private static readonly viewType = `floorfive-vs-code-panel.webview`;

    public static activate = (context: vscode.ExtensionContext) => {
        // Create a new webview panel
        vscode.window.registerWebviewViewProvider(PanelView.viewType, new PanelViewProvider(context));
    };

}

// View provider class
class PanelViewProvider implements vscode.WebviewViewProvider {

    private extensionUri: vscode.Uri;
    private iconsScript: string = ``;

    constructor(
        private readonly context: vscode.ExtensionContext
    ) {
        // Get path to resource on disk
        this.extensionUri = context.extensionUri;

    }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {

        // Register Console webview reference
        FFConsole.webviewRef = webviewView.webview;
        Store.panelViewWebview = webviewView.webview;
        Store.panelViewWebviewContext = this.context;

        // Replace icons variables
        this.iconsScript = IconsService.getIconsScript(this.context);

        // Set the webview's initial html content
        webviewView.webview.html = this.replaceTemplateVariables(HTML);

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, `assets`)]
        };

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(
            message => {
                this.messageHandler(webviewView.webview, message);
            },
            undefined,
            this.context.subscriptions
        );
    }

    private replaceTemplateVariables = (html: string): string => {

        const outputPanelThemeConfiguration = vscode.workspace.getConfiguration().get(`floorfive-vs-code.output-panel-theme`) as string ?? `github-dark`;

        return html
            .replace(/(?<!')\{\{outputPanelTheme\}\}(?!')/g, outputPanelThemeConfiguration)
            .replace(/(?<!')\{\{css\}\}(?!')/g, CSS)
            .replace(/(?<!')\{\{animationsCss\}\}(?!')/g, ANIMATIONS_CSS)
            .replace(/(?<!')\{\{categoriesButtons\}\}(?!')/g, this.getCategoriesButtons())
            .replace(/(?<!')\{\{js\}\}(?!')/g, PanelViewScript.getScript())
            .replace(/(?<!')\{\{iconsVariables\}\}(?!')/g, this.iconsScript); // Must be last
    };

    private getCategoriesButtons = (): string => {
        return Object.keys(Modules.getModules()).map((id: any) => {
            const module = Modules.getModule(id);
            if (module.showInPanel()) {
                return `<button class="category-button" id="${module.getId()}">${module.getLabel()}</button>`;
            }
        }).join(`\n`);
    };

    private messageHandler = (webview: vscode.Webview, message: any) => {

        switch (message.command) {
            case `set-active-panel`:
                webview.postMessage({
                    command: `set-active-panel:response`,
                    content: Modules.getModule(message.moduleId).commands[message.commandId].getLogContent()
                });
                break;
            case `clear-log`:
                Modules.getModule(message.moduleId).commands[message.commandId].clearConsole();
                break;
            case `open-local-link`:
                // Check if the path is a directory or a file
                if (fs.lstatSync(message.path).isDirectory()) {
                    // Open the directory in file explorer
                    vscode.commands.executeCommand(`revealFileInOS`, vscode.Uri.file(message.path));
                } else {
                    vscode.commands.executeCommand(`vscode.open`, vscode.Uri.file(message.path));
                }
                break;
            case `update-output-panel-theme:current`:
                Modules.getModule(`settings`).commands[`output-panel-theme`].updateOutputPanelWithCurrentTheme();
                break;
            case `show-info`:
                vscode.window.showInformationMessage(message.content);
                break;
            case `show-simple-error`:
                vscode.window.showErrorMessage(message.content);
                break;
        }
    };
}
