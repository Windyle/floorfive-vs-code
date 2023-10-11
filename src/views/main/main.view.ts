import * as vscode from "vscode";
import { Modules } from "../../modules/modules.index";
import { IconsService } from "../../services/icons.service";
import { ANIMATIONS_CSS } from "../_animations";
import { CSS } from "./main.view.css";
import { HTML } from "./main.view.html";
import { MainViewScript } from "./main.view.script";
import { Store } from "../../store";
import { MainViewMessageHandler } from "./main.view.message-handler";

/**
 * Represents the MainView class responsible for managing the webview.
 */
export class MainView {
    /**
     * The view type used for registration.
     */
    private static readonly viewType = "floorfive-vs-code.webview";

    /**
     * Activates the MainView.
     * @param {vscode.ExtensionContext} context - The extension context.
     */
    public static activate(context: vscode.ExtensionContext): void {
        try {
            // Create a new webview panel
            vscode.window.registerWebviewViewProvider(MainView.viewType, new MainViewProvider(context));
        }
        catch (err) {
            const error = err as Error;
            vscode.window.showErrorMessage(error.message);
        }
    }
}

/**
 * Represents the MainViewProvider class responsible for resolving the webview view.
 */
class MainViewProvider implements vscode.WebviewViewProvider {
    /**
     * The extension URI.
     */
    private readonly extensionUri: vscode.Uri;
    /**
     * The icons script.
     */
    private iconsScript: string = "";

    /**
     * Creates a new instance of MainViewProvider.
     * @param {vscode.ExtensionContext} context - The extension context.
     */
    constructor(
        private readonly context: vscode.ExtensionContext,
        private mainViewScript: MainViewScript = new MainViewScript(),
        private mainViewMessageHandler: MainViewMessageHandler = new MainViewMessageHandler()
    ) {
        this.extensionUri = context.extensionUri;
    }

    /**
     * Resolves the webview view.
     * @param {vscode.WebviewView} webviewView - The webview view.
     * @param {vscode.WebviewViewResolveContext<unknown>} context - The webview resolve context.
     * @param {vscode.CancellationToken} token - The cancellation token.
     */
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void {
        try {
            Store.mainViewWebview = webviewView.webview;
            Store.mainViewWebviewContext = this.context;
            this.iconsScript = IconsService.getIconsScript(this.context);

            // Set the webview's initial HTML content
            webviewView.webview.html = this.replaceTemplateVariables(HTML);

            webviewView.webview.options = {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "assets")]
            };

            // Handle messages from the webview
            webviewView.webview.onDidReceiveMessage(
                (message) => {
                    this.messageHandler(webviewView.webview, message);
                },
                undefined,
                this.context.subscriptions
            );
        }
        catch (err) {
            const error = err as Error;
            vscode.window.showErrorMessage(error.message);
        }
    }

    /**
     * Simple template engine for replacing placeholders with actual content.
     * This permits to separate different concerns (HTML, CSS, JS) in different files for better readability.
     * @param {string} html - The HTML content with placeholders.
     * @returns {string} The HTML content with replaced variables.
     */
    private replaceTemplateVariables(html: string): string {
        return html
            .replace(/(?<!')\{\{actionsHtml\}\}(?!')/g, this.generateModulesHtml())
            .replace(/(?<!')\{\{css\}\}(?!')/g, CSS)
            .replace(/(?<!')\{\{animationsCss\}\}(?!')/g, ANIMATIONS_CSS)
            .replace(/(?<!')\{\{js\}\}(?!')/g, this.mainViewScript.getScript())
            .replace(/(?<!')\{\{iconsVariables\}\}(?!')/g, this.iconsScript); // Must be last
    }

    /**
     * Generates HTML for modules by rendering their actions.
     * @returns {string} The HTML content for modules.
     */
    private generateModulesHtml(): string {
        const modulesHtml: string[] = [];

        Object.keys(Modules.getModules()).forEach((id: any) => {
            modulesHtml.push(Modules.getModule(id).getActionsHtml());
        });

        return modulesHtml.join("\n");
    }

    /**
     * Handles messages from the webview.
     * @param {vscode.Webview} webview - The webview.
     * @param {any} message - The received message.
     */
    private messageHandler(webview: vscode.Webview, message: any): void {
        try {
            if (message.command !== undefined && message.command !== null) {
                if (message.command.endsWith(":execute")) {
                    const [moduleId, commandId] = message.command.split(":");
                    Modules.getModule(moduleId).commands[commandId].execute();
                } else {
                    switch (message.command) {
                        case "@is-executing:check":
                            this.mainViewMessageHandler.isExecutingCheck(webview);
                            break;
                        case "@modal-action":
                            this.mainViewMessageHandler.modalAction(message.moduleId, message.commandId, message.actionId);
                            break;
                    }
                }
            }
        }
        catch (err) {
            const error = err as Error;
            vscode.window.showErrorMessage(error.message);
        }
    }
}
