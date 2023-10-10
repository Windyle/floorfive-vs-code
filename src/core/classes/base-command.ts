import { ConsoleInstantiator, FFConsole } from "../../services/console.service";
import { Store } from "../../store";
import { CommandConfig } from "../types/command-config";
import * as vscode from "vscode";

/**
 * BaseCommand class represents a base command used in the application.
 */
export class BaseCommand {
    /**
     * The module name of the command.
     */
    private _module: string;

    /**
     * The unique identifier of the command.
     */
    private _id: string;

    /**
     * The icon associated with the command.
     */
    private _icon: string;

    /**
     * The label or name of the command.
     */
    private _label: string;

    /**
     * The label to display in the loader.
     */
    private _loaderLabel: string;

    /**
     * Indicates whether the command should display a loader.
     */
    private _withLoader: boolean;

    /**
     * The console associated with the command.
     */
    protected console: FFConsole;

    /**
     * Indicates whether the command is currently executing.
     */
    private _executing: boolean = false;

    /**
     * The loader item associated with the command.
     */
    private _loaderItem: vscode.StatusBarItem | undefined;

    /**
     * Creates a new BaseCommand instance.
     * @param module The module name of the command.
     * @param id The unique identifier of the command.
     * @param icon The icon associated with the command.
     * @param label The label or name of the command.
     * @param withLoader Indicates whether the command should display a loader.
     */
    constructor(module: string, id: string, icon: string, label: string, withLoader: boolean, loaderLabel?: string) {
        this._module = module;
        this._id = id;
        this._icon = icon;
        this._label = label;
        this._withLoader = withLoader;
        this._loaderLabel = loaderLabel || `Executing ${label}...`;

        this.console = ConsoleInstantiator.instantiate(module, id);
    }

    // Getters

    /**
     * Get the configuration of the command.
     * @returns The command configuration.
     */
    public getConfig(): CommandConfig {
        return {
            id: this._id,
            icon: this._icon,
            label: this._label,
            withLoader: this._withLoader,
        };
    }

    /**
     * Get the module name of the command.
     * @returns The module name.
     */
    public getModule(): string {
        return this._module;
    }

    /**
     * Get the unique identifier of the command.
     * @returns The unique identifier.
     */
    public getId(): string {
        return this._id;
    }

    /**
     * Get the icon associated with the command.
     * @returns The icon.
     */
    public getIcon(): string {
        return this._icon;
    }

    /**
     * Get the label or name of the command.
     * @returns The label.
     */
    public getLabel(): string {
        return this._label;
    }

    /**
     * Get the label to display in the loader.
     * @returns The label.
     */
    public getLoaderLabel(): string {
        return this._loaderLabel;
    }

    /**
     * Get the loader state of the command.
     * @returns The loader state.
     */
    public getWithLoader(): boolean {
        return this._withLoader;
    }

    /**
     * Get the current state of the command.
     * @returns The current state.
     */
    public isExecuting(): boolean {
        return this._executing;
    }

    // Methods

    /**
     * Clear the console associated with the command.
     */
    public clearConsole(): void {
        this.console.clear();
    }

    private manageLoaderState(): void {
        if (this._executing && this._withLoader) {
            this.createLoaderItem();
        }
        else if (!this._executing && this._withLoader) {
            this._loaderItem?.dispose();
        }
    }

    private createLoaderItem(): void {
        // Create a new status bar item
        this._loaderItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -99999);

        // Set the text and tooltip for the status bar item
        this._loaderItem.text = `$(sync~spin) ${this.getLoaderLabel()}`;
        this._loaderItem.tooltip = `Executing ${this.getLabel()}`;

        // Show the status bar item
        this._loaderItem.show();
    }

    /**
     * Toggle the executing state of the command.
     */
    public toggleExecuting(): void {
        this._executing = !this._executing;
        this.manageLoaderState();
    }

    /**
     * Set the executing state of the command.
     * @param state The state to set.
     */
    public setExecuting(state: boolean): void {
        this._executing = state;
        this.manageLoaderState();
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
            moduleId: this._module,
            commandId: this._id,
        });
    }

    /**
     * Get the script for the command.
     * @returns The command script.
     */
    public getScript(): string {
        return `
// => ${this.getLabel()} Command

document.getElementById("${this._module}-${this._id}").addEventListener("click", function() {

    ${this._withLoader ? `setExecuting(this, '${this._icon}', '${this._label}');` : ``}
    
    const message = {
        command: '${this._module}:${this._id}:execute'
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
case '${this._module}:${this._id}:listener':
    ${this._withLoader ? `stopExecutingById("${this._module}-${this._id}", '${this._icon}', '${this._label}');` : ``}
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
case '${this._module}:${this._id}:log':
    if (activePanel === '${this._module}:${this._id}') {
        setActivePanelContent(message.content);
    }
break;
        `;
    }
}
