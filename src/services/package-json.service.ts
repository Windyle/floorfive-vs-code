import { Store } from "../store";
import * as fs from "node:fs";

/**
 * Quick access to the package.json file of the workspace.
 */
export class PackageJson {
  private static packageJson: object | undefined;
  private static modifiedDate: Date | undefined;

  /**
   * Indicates whether the workspace is a node project.
   * @returns {boolean} True if the workspace is a node project, false otherwise.
   */
  public static isNodeProject = (): boolean => {
    return fs.existsSync(`${Store.rootPath}/package.json`);
  };

  /**
   * Gets the package.json file of the workspace as an object.
   * @returns {object | undefined} The package.json file as an object or undefined if the file does not exist.
   */
  public static getPackageJson = (): object | undefined => {
    try {
      if (
        PackageJson.packageJson === undefined ||
        (PackageJson.modifiedDate !== undefined &&
          PackageJson.modifiedDate.getTime() !==
            new Date(fs.statSync(`${Store.rootPath}/package.json`).mtime).getTime())
      ) {
        PackageJson.packageJson = JSON.parse(fs.readFileSync(`${Store.rootPath}/package.json`, "utf-8"));
        PackageJson.modifiedDate = new Date(fs.statSync(`${Store.rootPath}/package.json`).mtime);
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
  public static getDependencies = (): { [dependency: string]: string } | undefined => {
    const packageJson = PackageJson.getPackageJson();
    return packageJson ? packageJson["dependencies" as keyof typeof packageJson] : undefined;
  };

  /**
   * Gets the devDependencies of the package.json file of the workspace.
   * @returns {object | undefined} The devDependencies of the package.json file or undefined if the file does not exist.
   */
  public static getDevDependencies = (): { [dependency: string]: string } | undefined => {
    const packageJson = PackageJson.getPackageJson();
    return packageJson ? packageJson["devDependencies" as keyof typeof packageJson] : undefined;
  };
}
