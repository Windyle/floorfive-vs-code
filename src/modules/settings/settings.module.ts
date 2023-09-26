import { BaseModule } from '../../core/classes/base-module';
import { Module } from '../../core/types/module';
import { OpenNpmrcCommand } from './commands/open-npmrc.command';
import { OutputPanelThemeCommand } from './commands/output-panel-theme.command';

export class SettingsModule extends BaseModule implements Module {

    constructor() {

        super(`settings`, `Settings`, `settings`);

        // Get commands instances
        const openNpmrcCommand = new OpenNpmrcCommand();
        const outputPanelThemeCommand = new OutputPanelThemeCommand();

        // Add commands instances to the commands object
        this.commands[openNpmrcCommand.getId()] = openNpmrcCommand;
        this.commands[outputPanelThemeCommand.getId()] = outputPanelThemeCommand;
    }

    public show(): boolean {
        // If every command in the module is hidden, don't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].show())) {
            return false;
        }

        return true;
    }

    public showInPanel(): boolean {
        return false;
    }

}