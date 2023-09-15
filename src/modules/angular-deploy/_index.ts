import * as fs from 'node:fs';
import * as path from 'node:path';
import { Store } from "../../store";

export class AngularDeployModule {

    public static show(): boolean {
        Store.rootPath;

        // If the root path contains an angular.json file, show the view
        if (fs.existsSync(path.join(Store.rootPath, 'angular.json'))) {
            return true;
        }

        return false;
    }

}