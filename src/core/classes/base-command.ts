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

    getLogScript(): string {
        return `
// ==> Compare
case '${this.getModule()}:${this.getId()}:log':
    panels["${this.getModule()}"]["${this.getId()}"] += '<code class="language-' + message.language + '">' + message.content + '</code>';

    if (activePanel === '${this.getModule()}:${this.getId()}') {
        setActivePanelContent('${this.getModule()}', '${this.getId()}');
    }
break;
        `;
    }
}