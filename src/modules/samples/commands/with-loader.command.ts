import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { Store } from "../../../store";

/**
 * A sample command without a loader.
 */
export class WithLoaderCommand extends BaseCommand implements Command {

    // Command Properties
    public showOnCommandPalette: boolean = false;

    // Custom properties
    private interval: NodeJS.Timeout | undefined;

    constructor() {
        // Call the parent constructor to initialize the command
        super({
            module: "samples",
            id: "with-loader",
            icon: "loader",
            label: "With Loader",
            withLoader: true,
            loaderLabel: "Executing command with loader...", // Optional loader label, if not provided, the command label will be used
            unstoppable: true, // Optional, if true, the command cannot be cancelled
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
        return true;
    }

    /**
     * Executes the command
     */
    execute(): void {

        if (!this.isExecuting()) {
            this.console.clear();

            // Navigate to the command's output panel if the extension's panel is active
            this.openLogPanel();

            // Set the command's execution state to true
            this.setExecuting(true);

            // Using the custom console to log a message in the extension's own output panel
            this.console.log(`Executing command: ${ this.getId() }`);

            let counter = 0;
            this.interval = setInterval(() => {
                // Custom console has a type definition for the log style
                this.console.log(`echo '${ counter }'`, "consoleCommand");
                counter++;

                if (counter > 10) {
                    this.console.log("Done!", "success");

                    this.cancel();
                }
            }, 1000);
        }
        else {

            // If a command is clicked while it is executing, cancel the command
            this.console.log("Command cancelled!", "error");

            this.cancel();
        }
    }

    /**
     * Cancels the command
     */
    cancel(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }

        // End the command's execution state and notify the webview that the command has finished
        this.setExecuting(false);

        // Note: it is possible to add properties to the message object, you can override the getListenerScript()
        // method declared in the BaseCommand class to add custom logic for the command's webview listener
        Store.mainViewWebview!.postMessage({
            command: `${ this.getModule() }:${ this.getId() }:listener`
        });
    }

}