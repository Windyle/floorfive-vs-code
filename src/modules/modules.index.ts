import { AngularBuildModule } from "./angular-build/angular-build.module";
import { Kbs6LibModule } from "./kbs6-lib/kbs6-lib.module";
import { SettingsModule } from "./settings/settings.module";

/**
 * Represents a utility class for managing modules.
 */
export class Modules {

    private static modules: { [id: string]: any } = {};

    /**
     * Initializes and sets module instances.
     * @static
     */
    public static setModules(): void {
        // Get modules instances
        const kbs6LibModule = new Kbs6LibModule();
        const angularBuildModule = new AngularBuildModule();
        const settingsModule = new SettingsModule();

        // Add module instances to the modules object
        Modules.modules[kbs6LibModule.getId()] = kbs6LibModule;
        Modules.modules[angularBuildModule.getId()] = angularBuildModule;
        Modules.modules[settingsModule.getId()] = settingsModule;
    }

    /**
     * Retrieves all modules as an object.
     * @returns {Object} An object containing all modules.
     * @static
     */
    public static getModules(): { [id: string]: any } {
        return Modules.modules;
    }

    /**
     * Retrieves all modules as an array.
     * @returns {Array} An array containing all modules.
     * @static
     */
    public static getModulesArray(): any[] {
        return Object.keys(Modules.modules).map((id: string) => Modules.modules[id]);
    }

    /**
     * Retrieves a specific module by its ID.
     * @param {string} moduleId - The ID of the module to retrieve.
     * @returns {any} The module instance.
     * @static
     */
    public static getModule(moduleId: string): any {
        return Modules.modules[moduleId];
    }
}
