import * as fs from 'node:fs';
import * as path from 'node:path';
import { BaseModule } from '../../core/classes/base-module';
import { Module } from '../../core/types/module';
import { Store } from "../../store";
import { CompareVersionCommand } from './commands/compare-version.command';
import { InstallLatestVersionCommand } from './commands/install-latest-version.command';
import { PublishCommand } from './commands/publish.command';

/**
 * Represents the Kbs6LibModule class responsible for managing KBS6 Lib-related functionality.
 */
export class Kbs6LibModule extends BaseModule implements Module {
    /**
     * Creates an instance of the Kbs6LibModule.
     */
    constructor() {
        super(`kbs6-lib`, `KBS6 Lib`, `book`);

        const compareVersionCommand = new CompareVersionCommand();
        const installLatestVersionCommand = new InstallLatestVersionCommand();
        const publishCommand = new PublishCommand();

        // Add command instances to the commands object
        this.commands[compareVersionCommand.getId()] = compareVersionCommand;
        this.commands[installLatestVersionCommand.getId()] = installLatestVersionCommand;
        this.commands[publishCommand.getId()] = publishCommand;
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

    /**
     * Checks if the workspace is a KBS6 Lib workspace.
     * @returns {boolean} True if the workspace is a KBS6 Lib workspace; otherwise, false.
     * @static
     */
    public static isKbs6LibWorkspace(): boolean {
        // If the root path contains a projects/kbs folder and a package.json file,
        // check if the package.json name field is '@kbs6/kbs-lib'
        if (fs.existsSync(path.join(Store.rootPath, `projects`, `kbs`))
            && fs.existsSync(path.join(Store.rootPath, `projects`, `kbs`, `package.json`))) {
            const packageJson = JSON.parse(fs.readFileSync(path.join(Store.rootPath, `projects`, `kbs`, `package.json`), `utf8`));
            if (packageJson.name === `@kbs6/kbs-lib`) {
                return true;
            }
        }

        return false;
    };
}
