import * as fs from 'node:fs';
import * as path from 'node:path';
import { Store } from "../../store";
import { BuildWatchCommand } from './build-watch.command';
import { BuildCommand } from './build.command';
import { ServeCommand } from "./serve.command";

export class AngularDevelopmentModule {

    public static show(): boolean {
        Store.rootPath;

        // If the root path contains an angular.json file, show the view
        if (fs.existsSync(path.join(Store.rootPath, 'angular.json'))) {
            return true;
        }

        return false;
    }

    public static serve: ServeCommand = new ServeCommand();
    public static build: BuildCommand = new BuildCommand();
    public static buildWatch: BuildWatchCommand = new BuildWatchCommand();

}