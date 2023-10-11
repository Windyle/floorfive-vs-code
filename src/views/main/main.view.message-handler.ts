import * as vscode from "vscode";
import { Modules } from "../../modules/modules.index";

/**
 * Handles messages received from the main view's webview.
 */
export class MainViewMessageHandler {

    /**
     * Check if a command is executing and send the result to the main view to render the executing state.
     * @param {vscode.Webview} webview - The webview.
     */
    public isExecutingCheck(webview: vscode.Webview): void {
        Modules.getModulesArray().forEach((module: any) => {
            Object.keys(module.commands).forEach((commandId: string) => {
                const command = module.commands[commandId];
                if (command.executing) {
                    webview.postMessage({
                        command: "@is-executing:listener",
                        moduleId: module.getId(),
                        commandId: command.getId(),
                        icon: command.getIcon(),
                        label: command.getLabel()
                    });
                }
            });
        });
    }

    /**
     * Executes a modal action.
     * @param {string} moduleId - The module ID.
     * @param {string} commandId - The command ID.
     * @param {string} actionId - The action ID.
     */
    public modalAction(moduleId: string, commandId: string, actionId: string): void {
        Modules.getModule(moduleId).commands[commandId].executeModalAction(actionId);
    }
}
