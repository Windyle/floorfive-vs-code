import * as fs from 'node:fs';
import * as path from 'node:path';
import { BaseModule } from '../../core/classes/base-module';
import { Module } from '../../core/types/module';
import { Store } from "../../store";
import { CompareVersionCommand } from './commands/compare-version.command';

export class Kbs6LibModule extends BaseModule implements Module {

    constructor() {

        super(`kbs6-lib`, `KBS6 Lib`, `book`);

        const compareVersionCommand = new CompareVersionCommand();

        // Add commands instances to the commands object
        this.commands[compareVersionCommand.getId()] = compareVersionCommand;
    }

    public show(): boolean {
        // If every command in the module is hidden or the project is not an angular project, don't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].show())
            || !fs.existsSync(path.join(Store.rootPath, `angular.json`))) {
            return false;
        }

        return true;
    }

    public showInPanel(): boolean {
        // If every command in the module is hidden in the panel or the project is not an angular project, don't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].showInPanel())
            || !fs.existsSync(path.join(Store.rootPath, `angular.json`))) {
            return false;
        }

        return true;
    }

    // Custom methods

    public isKbs6LibWorkspace(): boolean {
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