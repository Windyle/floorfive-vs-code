import { ConsoleInstantiator, FFConsole } from "../../services/console.service";
import { CommandConfig } from "../types/command-config";

export class BaseCommand {

    private id: string;
    private icon: string;
    private label: string;
    private withLoader: boolean;

    protected console: FFConsole;

    constructor(module: string, id: string, icon: string, label: string, withLoader: boolean) {
        this.id = id;
        this.icon = icon;
        this.label = label;
        this.withLoader = withLoader;

        this.console = ConsoleInstantiator.instantiate(
            module,
            id,
        );
    }

    public getConfig = (): CommandConfig => {
        return {
            id: this.id,
            icon: this.icon,
            label: this.label,
            withLoader: this.withLoader
        };
    };
}