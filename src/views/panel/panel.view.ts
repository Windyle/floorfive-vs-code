import * as fs from 'fs';
import * as vscode from 'vscode';
import { ANIMATIONS_CSS } from '../_animations';
import { ICONS, ICONS_SCRIPT } from '../_icons';
import { HTML } from './panel.view.html';
import { CSS } from './panel.view.css';
import { JS } from './panel.view.script';
import { FFConsole } from '../../services/console.service';
import { ConsoleCategories } from '../../core/enums/console-categories';
import { ConsoleTabs } from '../../core/enums/console-tabs';

// View class
export class PanelView {

    private static readonly viewType = 'floorfive-vs-code-panel.webview';

    public static activate = (context: vscode.ExtensionContext) => {
        // Create a new webview panel
        const panel = vscode.window.registerWebviewViewProvider(PanelView.viewType, new PanelViewProvider(context));
    };

}

// View provider class
class PanelViewProvider implements vscode.WebviewViewProvider {

    private extensionUri: vscode.Uri;
    private iconsPaths: { [key: string]: vscode.Uri } = {};
    private iconsScript: string = '';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) {
        // Get path to resource on disk
        this.extensionUri = context.extensionUri;

        // Get icons paths
        for (const icon of ICONS) {
            this.iconsPaths[icon] = vscode.Uri.joinPath(this.extensionUri, 'assets', 'icons', `${icon}.svg`);
        }
    }

    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {

        // Register Console webview reference
        FFConsole.webviewRef = webviewView.webview;

        // Replace icons variables
        this.iconsScript = ICONS_SCRIPT;
        for (const key of Object.keys(this.iconsPaths)) {
            const icon = fs.readFileSync(this.iconsPaths[key].fsPath, 'utf8');
            this.iconsScript = this.iconsScript.replace(`{{${this.formatIconName(key)}Icon}}`, icon);
        }

        // Set the webview's initial html content
        webviewView.webview.html = this.prepareTemplate(HTML);

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

    private formatIconName = (iconName: string): string => {
        // From 'check-circle' to 'checkCircle'
        return iconName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    };

    private prepareTemplate = (html: string): string => {
        html = this.replaceTemplateVariables(html);
        return html;
    };

    private replaceTemplateVariables = (html: string): string => {

        return html
            .replace(/(?<!')\{\{css\}\}(?!')/g, CSS)
            .replace(/(?<!')\{\{animationsCss\}\}(?!')/g, ANIMATIONS_CSS)
            .replace(/(?<!')\{\{js\}\}(?!')/g, JS)
            .replace(/(?<!')\{\{iconsVariables\}\}(?!')/g, this.iconsScript); // Must be last
    };

    private messageHandler = (webview: vscode.Webview, message: any) => {

        switch (message.command) {
        }
    };
}

export { JS };

