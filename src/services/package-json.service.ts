import { Store } from "../store";
import * as fs from 'node:fs';

export class PackageJson {

    public static isNodeProject = (): boolean => {
        return fs.existsSync(`${Store.rootPath}/package.json`);
    };

    public static getScript = (scriptName: string): string | undefined => {
        const scripts = PackageJson.getScripts();

        if (scripts) {
            return scripts[scriptName];
        }

        return undefined;
    };

    // Getters

    public static getPackageJson = (): any => {
        try {
            return JSON.parse(fs.readFileSync(`${Store.rootPath}/package.json`, `utf-8`));
        } catch (error) {
            return undefined;
        }
    };

    public static getDependencies = (): { [dependency: string]: string } | undefined => {
        const packageJson = PackageJson.getPackageJson();

        if (packageJson) {
            return packageJson.dependencies;
        }

        return undefined;
    };

    public static getDevDependencies = (): any => {
        const packageJson = PackageJson.getPackageJson();

        if (packageJson) {
            return packageJson.devDependencies;
        }

        return undefined;
    };

    public static getScripts = (): any => {
        const packageJson = PackageJson.getPackageJson();

        if (packageJson) {
            return packageJson.scripts;
        }

        return undefined;
    };
}