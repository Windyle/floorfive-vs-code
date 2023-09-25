import { ConsoleInstantiator, FFConsole } from "../../services/console.service";
import { CommandConfig } from "../types/command-config";

export class BaseCommand {

    private module: string;
    private id: string;
    private icon: string;
    private label: string;
    private withLoader: boolean;
    public executing: boolean = false;

    protected console: FFConsole;

    constructor(module: string, id: string, icon: string, label: string, withLoader: boolean) {
        this.module = module;
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

    public getModule = (): string => {
        return this.module;
    };

    public getId = (): string => {
        return this.id;
    };

    public getIcon = (): string => {
        return this.icon;
    };

    public getLabel = (): string => {
        return this.label;
    };

    public getWithLoader = (): boolean => {
        return this.withLoader;
    };

    public clearConsole = (): void => {
        this.console.clear();
    };

    public getLogContent = (): string => {
        return this.console.getLog();
    }

    getLogScript(): string {
        return `
// ==> Compare
case '${this.getModule()}:${this.getId()}:log':
    if (activePanel === '${this.getModule()}:${this.getId()}') {
        setActivePanelContent(message.content);
    }
break;
        `;
    }
}