import { DynamicSamplesModule } from "./dynamic-samples/dynamic-samples.module";
import { SamplesModule } from "./samples/samples.module";

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
        const samplesModule = new SamplesModule();
        const dynamicSamplesModule = new DynamicSamplesModule();

        // Add module instances to the modules object
        Modules.modules[samplesModule.getId()] = samplesModule;
        Modules.modules[dynamicSamplesModule.getId()] = dynamicSamplesModule;
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
