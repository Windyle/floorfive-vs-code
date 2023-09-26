import { ConsoleInstantiator, FFConsole } from "../../services/console.service";
import { Store } from "../../store";
import { CommandConfig } from "../types/command-config";

/**
 * BaseCommand class represents a base command used in the application.
 */
export class BaseCommand {
    /**
     * The module name of the command.
     */
    private module: string;

    /**
     * The unique identifier of the command.
     */
    private id: string;

    /**
     * The icon associated with the command.
     */
    private icon: string;

    /**
     * The label or name of the command.
     */
    private label: string;

    /**
     * Indicates whether the command should display a loader.
     */
    private withLoader: boolean;

    /**
     * Indicates whether the command is currently executing.
     */
    public executing: boolean = false;

    /**
     * The console associated with the command.
     */
    protected console: FFConsole;

    /**
     * Creates a new BaseCommand instance.
     * @param module The module name of the command.
     * @param id The unique identifier of the command.
     * @param icon The icon associated with the command.
     * @param label The label or name of the command.
     * @param withLoader Indicates whether the command should display a loader.
     */
    constructor(module: string, id: string, icon: string, label: string, withLoader: boolean) {
        this.module = module;
        this.id = id;
        this.icon = icon;
        this.label = label;
        this.withLoader = withLoader;

        this.console = ConsoleInstantiator.instantiate(module, id);
    }

    // Getters

    /**
     * Get the configuration of the command.
     * @returns The command configuration.
     */
    public getConfig(): CommandConfig {
        return {
            id: this.id,
            icon: this.icon,
            label: this.label,
            withLoader: this.withLoader,
        };
    }

    /**
     * Get the module name of the command.
     * @returns The module name.
     */
    public getModule(): string {
        return this.module;
    }

    /**
     * Get the unique identifier of the command.
     * @returns The unique identifier.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Get the icon associated with the command.
     * @returns The icon.
     */
    public getIcon(): string {
        return this.icon;
    }

    /**
     * Get the label or name of the command.
     * @returns The label.
     */
    public getLabel(): string {
        return this.label;
    }

    /**
     * Get the loader state of the command.
     * @returns The loader state.
     */
    public getWithLoader(): boolean {
        return this.withLoader;
    }


    // Methods

    /**
     * Clear the console associated with the command.
     */
    public clearConsole(): void {
        this.console.clear();
    }

    /**
     * Get the log content from the console associated with the command.
     * @returns The log content.
     */
    public getLogContent(): string {
        return this.console.getLog();
    }

    /**
     * Open the log panel for this command.
     */
    public openLogPanel(): void {
        Store.panelViewWebview?.postMessage({
            command: `set-active-panel:goto`,
            moduleId: this.module,
            commandId: this.id,
        });
    }

    /**
     * Get the script for the command.
     * @returns The command script.
     */
    public getScript(): string {
        return `
// => ${this.getLabel()} Command

document.getElementById("${this.module}-${this.id}").addEventListener("click", function() {

    ${this.withLoader ? `setExecuting(this, '${this.icon}', '${this.label}');` : ``}
    
    const message = {
        command: '${this.module}:${this.id}:execute'
    };

    vscode.postMessage(message);
});

// => End - ${this.getLabel()} Command
        `;
    }

    /**
     * Get the listener script for the command.
     * @returns The listener script.
     */
    public getListenerScript(): string {
        return `
case '${this.module}:${this.id}:listener':
    ${this.withLoader ? `stopExecutingById("${this.module}-${this.id}", '${this.icon}', '${this.label}');` : ``}
    break;
        `;
    }

    /**
     * Get the log script for the command.
     * @returns The log script.
     */
    public getLogScript(): string {
        return `
// ==> ${this.getLabel()} Command Log
case '${this.module}:${this.id}:log':
    if (activePanel === '${this.module}:${this.id}') {
        setActivePanelContent(message.content);
    }
break;
        `;
    }
}
