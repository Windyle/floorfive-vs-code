import { Kbs6LibModule } from "./kbs6-lib/kbs6-lib.module";

export class Modules {
    private static modules: { [id: string]: any } = {};

    public static setModules() {
        // Get modules instances
        const kbs6LibModule = new Kbs6LibModule();

        // Add modules instances to the modules object
        Modules.modules[kbs6LibModule.getId()] = kbs6LibModule;
    }

    public static getModules(): { [id: string]: any } {
        return Modules.modules;
    }

    public static getModulesArray(): any[] {
        return Object.keys(Modules.modules).map((id: string) => Modules.modules[id]);
    }

    public static getModule(moduleId: string): any {
        return Modules.modules[moduleId];
    }
}