import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";

/**
 * Represents the DeployCommand class responsible for managing the Deploy command.
 */
export class DeployCommand extends BaseCommand implements Command {

    // Command Properties
    public showOnCommandPalette: boolean = false;

    constructor(id: string, label: string) {
        // Call the parent constructor to initialize the command
        super(
            "angular-deploy",
            `${id}`,
            "plane",
            label,
            true
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
        return true;
    }

    execute(): void {

    }

}