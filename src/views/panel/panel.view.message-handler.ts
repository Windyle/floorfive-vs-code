import * as vscode from "vscode";
import * as fs from "fs";
import { Modules } from "../../modules/modules.index";

/**
 * Handles messages received from the panel view's webview.
 */
export class PanelViewMessageHandler {

    /**
     * Sets the active panel in the panel view.
     * @param {vscode.Webview} webview - The webview.
     * @param {string} moduleId - The module ID.
     * @param {string} commandId - The command ID.
     * @returns {string} The active panel identifier.
     */
    public setActivePanel(webview: vscode.Webview, moduleId: string, commandId: string): string {
        try {
            const content: string = Modules.getModule(moduleId).commands[commandId].getLogContent();

            webview.postMessage({
                command: "set-active-panel:response",
                content: content
            });
        }
        catch (err) {
            const error = err as Error;
            vscode.window.showErrorMessage(error.message);
        }

        return `${ moduleId }:${ commandId }`;
    }

    /**
     * Sets the active panel in the panel view when it loads.
     * @param {vscode.Webview} webview - The webview.
     * @param {string} activePanel - The active panel identifier.
     */
    public setActivePanelOnLoad(webview: vscode.Webview, activePanel: string): void {
        if (activePanel.trim() !== "" && activePanel.includes(":")) {
            webview.postMessage({
                command: "set-active-panel:goto",
                moduleId: activePanel.split(":")[0],
                commandId: activePanel.split(":")[1]
            });

            webview.postMessage({
                command: "set-active-panel:response",
                content: Modules.getModule(activePanel.split(":")[0]).commands[activePanel.split(":")[1]].getLogContent(),
            });
        }
        else {
            vscode.window.showErrorMessage(`Invalid active panel: ${ activePanel }`);
        }
    }

    /**
     * Clears the log of a specific module command.
     * @param {string} moduleId - The module ID.
     * @param {string} commandId - The command ID.
     */
    public clearLog(moduleId: string, commandId: string): void {
        try {
            Modules.getModule(moduleId).commands[commandId].clearConsole();
        }
        catch (err) {
            const error = err as Error;
            vscode.window.showErrorMessage(error.message);
        }
    }

    /**
     * Opens a local file or directory link.
     * @param {string} path - The path to the file or directory.
     */
    public openLocalLink(path: string): void {
        if (fs.lstatSync(path).isDirectory()) {
            vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(path));
        } else {
            vscode.commands.executeCommand("vscode.open", vscode.Uri.file(path));
        }
    }

    /**
     * Updates the output panel theme to the current theme.
     */
    public updateOutputPanelThemeCurrent(): void {
        try {
            Modules.getModule("settings").commands["output-panel-theme"].updateOutputPanelWithCurrentTheme();
        }
        catch (err) {
            const error = err as Error;
            vscode.window.showErrorMessage(error.message);
        }
    }

    /**
     * Shows an information message.
     * @param {string} message - The message to show.
     */
    public showInfo(message: string): void {
        vscode.window.showInformationMessage(message);
    }

    /**
     * Shows an error message.
     * @param {string} message - The error message to show.
     */
    public showError(message: string): void {
        vscode.window.showErrorMessage(message);
    }
}
