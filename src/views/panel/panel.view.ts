import * as vscode from 'vscode';
import { FFConsole } from '../../services/console.service';
import { IconsService } from '../../services/icons.service';
import { ANIMATIONS_CSS } from '../_animations';
import { CSS } from './panel.view.css';
import { HTML } from './panel.view.html';
import { Modules } from '../../modules/modules.index';
import { PanelViewScript } from './panel.view.script';

// View class
export class PanelView {

    private static readonly viewType = 'floorfive-vs-code-panel.webview';

    public static activate = (context: vscode.ExtensionContext) => {
        // Create a new webview panel
        vscode.window.registerWebviewViewProvider(PanelView.viewType, new PanelViewProvider(context));
    };

}

// View provider class
class PanelViewProvider implements vscode.WebviewViewProvider {

    private extensionUri: vscode.Uri;
    private iconsScript: string = '';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) {
        // Get path to resource on disk
        this.extensionUri = context.extensionUri;

    }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {

        // Register Console webview reference
        FFConsole.webviewRef = webviewView.webview;

        // Replace icons variables
        this.iconsScript = IconsService.getIconsScript(this.context);

        // Set the webview's initial html content
        webviewView.webview.html = this.replaceTemplateVariables(HTML);

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'assets')]
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

        return html
            .replace(/(?<!')\{\{css\}\}(?!')/g, CSS)
            .replace(/(?<!')\{\{animationsCss\}\}(?!')/g, ANIMATIONS_CSS)
            .replace(/(?<!')\{\{categoriesButtons\}\}(?!')/g, this.getCategoriesButtons())
            .replace(/(?<!')\{\{js\}\}(?!')/g, PanelViewScript.getScript())
            .replace(/(?<!')\{\{iconsVariables\}\}(?!')/g, this.iconsScript); // Must be last
    };

    private getCategoriesButtons = (): string => {
        return Object.keys(Modules.getModules()).map((id: any) => {
            const module = Modules.getModule(id);
            if (module.show()) {
                return `<button class="category-button" id="${module.getId()}">${module.getLabel()}</button>`;
            }
        }).join('\n');
    };

    private messageHandler = (webview: vscode.Webview, message: any) => {

        switch (message.command) {
            case `format-links`:
                const formattedText = FFConsole.formatLinks(message.text);

                webview.postMessage({
                    command: `format-links:response`,
                    text: formattedText,
                    activePanel: message.activePanel
                });
                break;
        }
    };
}
