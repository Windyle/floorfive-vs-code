import * as vscode from "vscode";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";

/**
 * A sample command without a loader.
 */
export class GithubCommand extends BaseCommand implements Command {

    // Command Properties
    public showOnCommandPalette: boolean = true;

    constructor() {
        // Call the parent constructor to initialize the command
        super({
            module: "samples",
            id: "github-command",
            icon: "github",
            label: "Github",
            customize: {
                // If only one set of customizations is provided, it will be used for both light and dark themes.
                dark: {
                    textColor: "#FFFFFF",
                    backgroundColor: "#0d1117",
                    borderColor: "#21262d"
                }
            }
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
        const githubURL = "https://github.com/Windyle/floorfive-vs-code";
        vscode.env.openExternal(vscode.Uri.parse(githubURL));
    }

}