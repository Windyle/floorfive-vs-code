import * as fs from 'node:fs';
import * as path from 'node:path';
import { BaseModule } from '../../core/classes/base-module';
import { Module } from '../../core/types/module';
import { Store } from "../../store";
import { BuildCommand } from './commands/build.command';
import { Utilities } from '../../services/utilities.service';

/**
 * Represents the Kbs6LibModule class responsible for managing KBS6 Lib-related functionality.
 */
export class AngularBuildModule extends BaseModule implements Module {
    /**
     * Creates an instance of the Kbs6LibModule.
     */
    constructor() {
        super(`angular-build`, `Angular Build`, `hammer`);

        if (fs.existsSync(path.join(Store.rootPath, `angular.json`))) {

            // Read environments from angular.json
            const angularJson = JSON.parse(fs.readFileSync(path.join(Store.rootPath, `angular.json`), `utf8`));

            // Get projects of projectType application from angular.json
            const projects = Object.keys(angularJson.projects).filter((project: string) => angularJson.projects[project].projectType === `application`);

            // Get configurations from angular.json at <project>.architect.build.configurations
            const configurations = projects.map((project: string) => Object.keys(angularJson.projects[project].architect.build.configurations)).flat();

            configurations.forEach((configuration: string) => {
                this.commands[configuration] = new BuildCommand(configuration, Utilities.capitalize(Utilities.snakeToCamel(configuration, true)));
            });

        }
    }

    /**
     * Determines whether to show the module.
     * @returns {boolean} True if any command in the module should be shown; otherwise, false.
     */
    public show(): boolean {
        // If every command in the module is hidden or the project is not an Angular project, don't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].show())
            || !fs.existsSync(path.join(Store.rootPath, `angular.json`))) {
            return false;
        }

        return true;
    }

    /**
     * Determines whether to show the module in a panel.
     * @returns {boolean} True if any command in the module should be shown in a panel; otherwise, false.
     */
    public showInPanel(): boolean {
        // If every command in the module is hidden in the panel or the project is not an Angular project, don't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].showInPanel())
            || !fs.existsSync(path.join(Store.rootPath, `angular.json`))) {
            return false;
        }

        return true;
    }
}
