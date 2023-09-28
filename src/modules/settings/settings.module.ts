import { BaseModule } from '../../core/classes/base-module';
import { Module } from '../../core/types/module';
import { OpenNpmrcCommand } from './commands/open-npmrc.command';

/**
 * Represents the SettingsModule class responsible for managing settings-related functionality.
 */
export class SettingsModule extends BaseModule implements Module {
    /**
     * Creates an instance of the SettingsModule.
     */
    constructor() {
        super(`settings`, `Settings`, `settings`);

        // Get command instances
        const openNpmrcCommand = new OpenNpmrcCommand();

        // Add command instances to the commands object
        this.commands[openNpmrcCommand.getId()] = openNpmrcCommand;
    }

    /**
     * Determines whether to show the module.
     * @returns {boolean} True if any command in the module should be shown; otherwise, false.
     */
    public show(): boolean {
        // If every command in the module is hidden, don't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].show())) {
            return false;
        }

        return true;
    }

    /**
     * Determines whether to show the module in a panel.
     * @returns {boolean} Always returns false for this module.
     */
    public showInPanel(): boolean {
        return false;
    }
}
