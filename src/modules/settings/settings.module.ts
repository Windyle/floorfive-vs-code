import * as fs from 'node:fs';
import * as path from 'node:path';
import { BaseModule } from '../../core/classes/base-module';
import { Module } from '../../core/types/module';
import { Store } from "../../store";
import { OpenNpmrcCommand } from './commands/open-npmrc.command';

export class SettingsModule extends BaseModule implements Module {

    constructor() {

        super(`settings`, `Settings`, `settings`);

        // Get commands instances
        const openNpmrcCommand = new OpenNpmrcCommand();

        // Add commands instances to the commands object
        this.commands[openNpmrcCommand.getId()] = openNpmrcCommand;
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