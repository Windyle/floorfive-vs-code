import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";

/**
 * A command for opening the user's .npmrc file quickly.
 */
export class OpenNpmrcCommand extends BaseCommand implements Command {

    // Command Properties
    public showOnCommandPalette: boolean = false;

    constructor() {
        // Call the parent constructor to initialize the command
        super(
            "settings",
            "open-npmrc",
            "edit",
            "Open .npmrc",
            false
        );
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
     * Executes the command to open the .npmrc file.
     */
    execute(): void {
        // Construct the path to the .npmrc file
        const npmrcPath = path.join(process.env.USERPROFILE || "", ".npmrc");

        // Ensure the parent directory exists
        const npmrcDir = path.dirname(npmrcPath);
        if (!fs.existsSync(npmrcDir)) {
            vscode.window.showErrorMessage(`The directory ${npmrcDir} does not exist!`);
        }

        // Check if the file exists, and if not, create it
        if (!fs.existsSync(npmrcPath)) {
            fs.writeFileSync(npmrcPath, "");
        }

        // Open the file in the editor
        this.openFile(npmrcPath);
    }

    /**
     * Opens a file in the VS Code editor.
     * @param {string} path - The path of the file to open.
     */
    private openFile(path: string): void {
        vscode.workspace.openTextDocument(path).then((doc) => {
            vscode.window.showTextDocument(doc);
        });
    }
}