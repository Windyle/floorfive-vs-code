import * as fs from "node:fs";
import * as path from "node:path";
import { BaseModule } from "../../core/classes/base-module";
import { Module } from "../../core/types/module";
import { Store } from "../../store";
import { Utilities } from "../../services/utilities.service";
import { DynamicEchoCommand } from "./commands/dynamic-echo.command";

/**
 * A sample module that creates multiple instances of a command based on a configuration.
 */
export class DynamicSamplesModule extends BaseModule implements Module {
    /**
     * Creates an instance of the Kbs6LibModule.
     */
    constructor() {
        super("dynamic-samples", "Dynamic Samples", "plane-departure");

        const configurations = [
            "red-monkey",
            "blue-horse",
            "green-dog",
            "yellow-cat",
            "purple-zebra"
        ];

        configurations.forEach((configuration: string) => {
            this.commands[configuration] = new DynamicEchoCommand(configuration, `Echo ${ Utilities.capitalize(Utilities.snakeToCamel(configuration, true)) }`);
        });
    }

    /**
     * Determines whether to show the module.
     * @returns {boolean} True if any command in the module should be shown; otherwise, false.
     */
    public show(): boolean {
        // If every command in the module is hiddendon't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].show())) {
            return false;
        }

        return true;
    }

    /**
     * Determines whether to show the module in a panel.
     * @returns {boolean} True if any command in the module should be shown in a panel; otherwise, false.
     */
    public showInPanel(): boolean {
        // If every command in the module is hidden in the panel, don't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].showInPanel())) {
            return false;
        }

        return true;
    }
}
