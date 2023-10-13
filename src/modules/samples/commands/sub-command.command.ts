import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";

/**
 * A sample sub-command without a loader.
 */
export class SubCommandCommand extends BaseCommand implements Command {

    // Command Properties
    public showOnCommandPalette: boolean = true;

    constructor() {
        // Call the parent constructor to initialize the command
        super({
            module: "samples",
            id: "sub-command",
            icon: "code",
            label: "Sub Command",
            subCommand: true
        });
    }

    /**
     * Determines whether to show this command based on the current workspace.
     * @returns {boolean} True if the command should be shown, otherwise false.
     */
    show(): boolean {
        return true;
    }

    /**
     * Determines whether to show this command in the panel.
     * @returns {boolean} True if the command should be shown in the panel, otherwise false.
     */
    showInPanel(): boolean {
        return false;
    }

    /**
     * Executes the command
     */
    execute(): void {

        // Open a new file in the editor
        const newFile = vscode.Uri.parse(`untitled:${ path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, "new-file-by-sub.txt") }`);
        vscode.workspace.openTextDocument(newFile).then((document) => {
            vscode.window.showTextDocument(document);
        });
    }

}