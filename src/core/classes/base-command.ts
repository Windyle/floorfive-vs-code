import { ConsoleInstantiator, FFConsole } from "../../services/console.service";
import { Store } from "../../store";
import { CommandButtonCustomizations, CommandConfig } from "../types/command-config";
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
     * Indicates whether the command is a sub-command.
     */
    private _isSubCommand: boolean = false;

    /**
     * Customizations for the button's style.
     */
    private _customizations: {
        light?: CommandButtonCustomizations;
        dark?: CommandButtonCustomizations;
    } = {};

    /**
     * Creates a new BaseCommand instance.
     * @param module The module name of the command.
     * @param id The unique identifier of the command.
     * @param icon The icon associated with the command.
     * @param label The label or name of the command.
     * @param withLoader Indicates whether the command should display a loader.
     */
    constructor(config: CommandConfig) {
        this._module = config.module;
        this._id = config.id;
        this._icon = config.icon;
        this._label = config.label;
        this._withLoader = config.withLoader || false;
        this._loaderLabel = config.loaderLabel || `Executing ${ config.label }...`;
        this._isSubCommand = config.subCommand || false;
        this._customizations = config.customize || {};

        this.console = ConsoleInstantiator.instantiate(config.module, config.id);
    }

    // Getters

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
     * Set the icon associated with the command at runtime.
     * @param icon The icon.
     */
    public setIcon(icon: string): void {
        this._icon = icon;
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
     * Get the customizations for the button's style.
     * @returns The customizations.
     */
    public getCustomizations(): CommandButtonCustomizations {

        // Check if one of the customizations is set, if both are set return the one for the current theme, otherwise return the one that is set
        if (this._customizations.light && this._customizations.dark) {
            // Check if the current theme is dark or light
            const isDark = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark;

            // Return the customizations for the current theme
            return (isDark ? this._customizations.dark : this._customizations.light) || {};
        }
        else if (this._customizations.light) {
            return this._customizations.light;
        }
        else if (this._customizations.dark) {
            return this._customizations.dark;
        }

        return {};
    }

    /**
     * Get the current state of the command.
     * @returns The current state.
     */
    public isExecuting(): boolean {
        return this._executing;
    }

    /**
     * Returns whether the command is a sub-command.
     * @returns True if the command is a sub-command; otherwise, false. 
     */
    public isSubCommand(): boolean {
        return this._isSubCommand;
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
        this._loaderItem.text = `$(sync~spin) ${ this.getLoaderLabel() }`;
        this._loaderItem.tooltip = `Executing ${ this.getLabel() }`;

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
            command: "set-active-panel:goto",
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
// => ${ this.getLabel() } Command

document.getElementById("${ this._module }-${ this._id }").addEventListener("click", function() {

    ${ this._withLoader ? `setExecuting(this, '${ this._icon }', '${ this._label }');` : "" }
    
    const message = {
        command: '${ this._module }:${ this._id }:execute'
    };

    vscode.postMessage(message);
});

// => End - ${ this.getLabel() } Command
        `;
    }

    /**
     * Get the listener script for the command.
     * @returns The listener script.
     */
    public getListenerScript(): string {
        return `
case '${ this._module }:${ this._id }:listener':
    ${ this._withLoader ? `stopExecutingById("${ this._module }-${ this._id }", '${ this._icon }', '${ this._label }');` : "" }
    break;
        `;
    }

    /**
     * Get the log script for the command.
     * @returns The log script.
     */
    public getLogScript(): string {
        return `
// ==> ${ this.getLabel() } Command Log
case '${ this._module }:${ this._id }:log':
    if (activePanel === '${ this._module }:${ this._id }') {
        setActivePanelContent(message.content);
    }
break;
        `;
    }
}
