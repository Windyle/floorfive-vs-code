import { Store } from "../store";
import * as fs from "node:fs";

/**
 * Quick access to the package.json file of the workspace.
 */
export class PackageJson {

    private static packageJson: object | undefined;

    /**
     * Indicates whether the workspace is a node project.
     * @returns {boolean} True if the workspace is a node project, false otherwise.
     */
    public static isNodeProject = (): boolean => {
        return fs.existsSync(`${ Store.rootPath }/package.json`);
    };

    /**
     * Gets the package.json file of the workspace as an object.
     * @returns {object | undefined} The package.json file as an object or undefined if the file does not exist.
     */
    public static getPackageJson = (): object | undefined => {
        try {
            if (PackageJson.packageJson === undefined) {
                PackageJson.packageJson = JSON.parse(fs.readFileSync(`${ Store.rootPath }/package.json`, "utf-8"));
            }

            return PackageJson.packageJson;
        } catch (error) {
            return undefined;
        }
    };

    /**
     * Gets the dependencies of the package.json file of the workspace.
     * @returns {object | undefined} The dependencies of the package.json file or undefined if the file does not exist.
     */
    public static getDependencies = (): object | undefined => {
        const packageJson = PackageJson.getPackageJson();
        return packageJson ? packageJson["dependencies" as keyof typeof packageJson] : undefined;
    };
}