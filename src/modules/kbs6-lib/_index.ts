import * as fs from 'node:fs';
import * as path from 'node:path';
import { Store } from "../../store";
import { Modules } from '../../core/enums/console-categories';

export class Kbs6LibModule {

    public static readonly moduleName = Modules.kbs6Lib;
    public static readonly commands = [

    ];

    public static show(): boolean {
        // If the root path contains an angular.json file, show the view
        if (fs.existsSync(path.join(Store.rootPath, 'angular.json'))) {
            return true;
        }

        return false;
    }

    public static isKbs6LibWorkspace(): boolean {
        // If the root path contains a projects/kbs folder and a package.json file,
        // check if the package.json name field is '@kbs6/kbs-lib'
        if (fs.existsSync(path.join(Store.rootPath, 'projects', 'kbs'))
            && fs.existsSync(path.join(Store.rootPath, 'projects', 'kbs', 'package.json'))) {
            const packageJson = JSON.parse(fs.readFileSync(path.join(Store.rootPath, 'projects', 'kbs', 'package.json'), 'utf8'));
            if (packageJson.name === '@kbs6/kbs-lib') {
                return true;
            }
        }

        return false;
    };

}