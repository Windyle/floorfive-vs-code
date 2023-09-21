import * as fs from 'fs';
import * as vscode from 'vscode';
import { AngularDeployModule } from '../../modules/angular-deploy/_index';
import { KbsMobileModule } from '../../modules/kbs-mobile/_index';
import { Kbs6LibModule } from '../../modules/kbs6-lib/_index';
import { ANIMATIONS_CSS } from '../_animations';
import { ICONS, ICONS_SCRIPT } from '../_icons';
import { CSS } from './main.view.css';
import { HTML } from './main.view.html';
import { JS } from './main.view.script';

// View class
export class MainView {

    private static readonly viewType = 'floorfive-vs-code.webview';

    public static activate = (context: vscode.ExtensionContext) => {
        // Create a new webview panel
        const panel = vscode.window.registerWebviewViewProvider(MainView.viewType, new MainViewProvider(context));
    };

}

// View provider class
class MainViewProvider implements vscode.WebviewViewProvider {

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
        html = this.hideModules(html);
        return html;
    };

    private hideModules = (html: string): string => {

        // Angular Deploy
        if (!AngularDeployModule.show()) {
            html = html
                .replace(`<div class="collapsible" id="angular-deploy-collapsible">`, `<div class="collapsible" id="angular-deploy-collapsible" style="display: none;">`)
                .replace(`<div class="btns-container" id="angular-deploy-btns-container">`, `<div class="btns-container" id="angular-deploy-btns-container" style="display: none;">`);
        }

        // KBS6 Lib
        if (!Kbs6LibModule.show()) {
            html = html
                .replace(`<div class="collapsible" id="kbs6-lib-collapsible">`, `<div class="collapsible" id="kbs6-lib-collapsible" style="display: none;">`)
                .replace(`<div class="btns-container" id="kbs6-lib-btns-container">`, `<div class="btns-container" id="kbs6-lib-btns-container" style="display: none;">`);
        }
        else {
            if (!Kbs6LibModule.isKbs6LibWorkspace()) {
                html = html
                    .replace(`<button class="command-button icon-button" id="kbs6-lib-publish"><icon name="upload-cloud"></icon> <label>Publish</label></button>`, ``);
            }
            else {
                html = html
                    .replace(`<button class="command-button icon-button" id="kbs6-lib-install"><icon name="download-cloud"></icon> <label>Install Latest</label></button>`, ``)
                    .replace(`<button class="command-button icon-button" id="kbs6-lib-compare"><icon name="arrows-right-left"></icon> <label>Compare Version</label></button>`, ``);
            }
        }

        // KBS Mobile
        if (!KbsMobileModule.show()) {
            html = html
                .replace(`<div class="collapsible" id="kbs-mobile-collapsible">`, `<div class="collapsible" id="kbs-mobile-collapsible" style="display: none;">`)
                .replace(`<div class="btns-container" id="kbs-mobile-btns-container">`, `<div class="btns-container" id="kbs-mobile-btns-container" style="display: none;">`);
        }

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

