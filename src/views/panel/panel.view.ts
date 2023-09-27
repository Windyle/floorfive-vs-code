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
import { PanelViewMessageHandler } from './panel.view.message-handler';

/**
 * Represents the panel view for the extension.
 */
export class PanelView {

    private static readonly viewType = `floorfive-vs-code-panel.webview`;

    /**
     * Activates the panel view.
     * @param {vscode.ExtensionContext} context - The extension context.
     */
    public static activate(context: vscode.ExtensionContext) {
        // Create a new webview panel
        vscode.window.registerWebviewViewProvider(PanelView.viewType, new PanelViewProvider(context));
    };
}

/**
 * Provider for the panel view.
 */
class PanelViewProvider implements vscode.WebviewViewProvider {

    private extensionUri: vscode.Uri;
    private iconsScript: string = ``;
    private activePanel: string = ``;

    /**
     * Creates an instance of PanelViewProvider.
     * @param {vscode.ExtensionContext} context - The extension context.
     */
    constructor(
        private readonly context: vscode.ExtensionContext,
        private panelViewScript: PanelViewScript = new PanelViewScript(),
        private messageHandlerService: PanelViewMessageHandler = new PanelViewMessageHandler()
    ) {
        // Get path to resource on disk
        this.extensionUri = context.extensionUri;

        // Get initial active panel
        const initialCommand = Modules.getModulesArray().filter((module: any) => module.showInPanel())[0].getCommandsArray().filter((command: any) => command.showInPanel())[0];
        this.activePanel = `${initialCommand.getModule()}:${initialCommand.getId()}`;
    }

    /**
     * Resolves the webview view.
     * @param {vscode.WebviewView} webviewView - The webview view to resolve.
     * @param {vscode.WebviewViewResolveContext<unknown>} context - The webview view resolve context.
     * @param {vscode.CancellationToken} token - The cancellation token.
     */
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

    /**
     * Replaces template variables in HTML content.
     * @param {string} html - The HTML content.
     * @returns {string} The HTML content with replaced variables.
     */
    private replaceTemplateVariables(html: string): string {
        const outputPanelThemeConfiguration = vscode.workspace.getConfiguration().get(`floorfive-vs-code.output-panel-theme`) as string ?? `github-dark`;

        return html
            .replace(/(?<!')\{\{outputPanelTheme\}\}(?!')/g, outputPanelThemeConfiguration)
            .replace(/(?<!')\{\{css\}\}(?!')/g, CSS)
            .replace(/(?<!')\{\{animationsCss\}\}(?!')/g, ANIMATIONS_CSS)
            .replace(/(?<!')\{\{categoriesButtons\}\}(?!')/g, this.getCategoriesButtons())
            .replace(/(?<!')\{\{js\}\}(?!')/g, this.panelViewScript.getScript())
            .replace(/(?<!')\{\{iconsVariables\}\}(?!')/g, this.iconsScript); // Must be last
    };

    /**
     * Retrieves the category buttons for the view.
     * @returns {string} The category buttons HTML.
     */
    private getCategoriesButtons(): string {
        return Object.keys(Modules.getModules()).map((id: any) => {
            const module = Modules.getModule(id);
            if (module.showInPanel()) {
                return `<button class="category-button" id="${module.getId()}">${module.getLabel()}</button>`;
            }
        }).join(`\n`);
    };

    /**
     * Handles messages received from the webview.
     * @param {vscode.Webview} webview - The webview.
     * @param {any} message - The received message.
     */
    private messageHandler(webview: vscode.Webview, message: any) {
        switch (message.command) {
            case `set-active-panel`:
                this.activePanel = this.messageHandlerService.setActivePanel(webview, message.moduleId, message.commandId);
                break;

            case `set-active-panel:onload`:
                this.messageHandlerService.setActivePanelOnLoad(webview, this.activePanel);
                break;

            case `clear-log`:
                this.messageHandlerService.clearLog(message.moduleId, message.commandId);
                break;

            case `open-local-link`:
                this.messageHandlerService.openLocalLink(message.path);
                break;

            case `update-output-panel-theme:current`:
                this.messageHandlerService.updateOutputPanelThemeCurrent();
                break;

            case `show-info`:
                this.messageHandlerService.showInfo(message.content);
                break;

            case `show-error`:
                this.messageHandlerService.showError(message.content);
                break;
        }
    };
}
