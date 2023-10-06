import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { Store } from "../../../store";
import { VSCodeTerminalColors } from "../../../core/enums/vscode-terminal-colors";

/**
 * Sample command that runs a different execution based on the command ID.
 */
export class DynamicEchoCommand extends BaseCommand implements Command {

    // Command Properties
    public showOnCommandPalette: boolean = false;

    // Custom properties
    private timeout: NodeJS.Timeout | undefined;

    constructor(id: string, label: string) {
        // Call the parent constructor to initialize the command
        super(
            "dynamic-samples",
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

        // NOTE: Every command instance will have its own panel, the extension will handle the rendering
        return true;
    }

    execute(): void {
        this.openLogPanel();

        this.toggleExecuting();
        if (this.isExecuting()) {

            this.console.clear();
            this.console.log(`Starting process...`, `color`, [VSCodeTerminalColors.brightMagenta]);

            this.console.log(`Writing echo in 3 seconds...`, `color`, [VSCodeTerminalColors.brightBlue]);

            this.timeout = setTimeout(() => {
                this.console.log(`echo ${this.getId()}`, `color`, [VSCodeTerminalColors.brightBlue]);

                this.stopExecuting();
            }, 3000);
        }
        else {
            this.console.log(`Process killed.`, `error`);

            this.stopExecuting();
        }
    }

    private stopExecuting() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.setExecuting(false);

        Store.mainViewWebview!.postMessage({
            command: `${this.getModule()}:${this.getId()}:listener`
        });
    }

}