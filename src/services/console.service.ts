import * as vscode from "vscode";

/**
 * Instantiator class for the extension's custom console class.
 * It's used to get a different instance of the console for each command.
 */
export class ConsoleInstantiator {

    public static instances = new Map<string, FFConsole>();

    /**
     * Instantiate a new console instance for the command.
     * @param moduleId The module ID of the command.
     * @param commandId The command ID.
     * @returns {FFConsole} The new console instance.
     */
    public static instantiate = (moduleId: string, commandId: string): FFConsole => {
        const instance = new FFConsole(moduleId, commandId);
        ConsoleInstantiator.instances.set(`${moduleId}:${commandId}`, instance);

        return instance;
    };

    /**
     * Get the console instance for the command.
     * @param moduleId The module ID of the command.
     * @param commandId The command ID.
     * @returns {FFConsole} The console instance.
     */
    public static getInstance = (moduleId: string, commandId: string): FFConsole | undefined => {
        return ConsoleInstantiator.instances.get(`${moduleId}:${commandId}`);
    };
}

/**
 * Custom console class for the extension's custom output panel.
 */
export class FFConsole {

    private _categoryId: string;
    private _tabId: string;
    private _log: string = ``;
    public static webviewRef: vscode.Webview | undefined;

    /**
     * Creates a new instance of the FFConsole class.
     * @param moduleId The module ID of the command.
     * @param commandId The command ID.
     */
    constructor(moduleId: string, commandId: string) {
        this._categoryId = moduleId;
        this._tabId = commandId;
    };

    /**
     * Get the persisted log for the command.
     * @returns {string} The persisted log.
     */
    public getLog = (): string => {
        return this._log;
    };

    /**
     * Different message formats for the console, used by the log method.
     */
    private _logTypes: { [method: string]: any } = {
        plain: (message: string): string => {
            return `<pre>${message}</pre>`;
        },
        consoleCommand: (message: string): string => {
            return this.consoleCommandFormat(message);
        },
        alert: (message: string): string => {
            return `<pre style="color: var(--vscode-terminal-ansiBrightYellow);">${message}</pre>`;
        },
        error: (message: string): string => {
            return `<pre style="color: var(--vscode-terminal-ansiRed);">${message}</pre>`;
        },
        success: (message: string): string => {
            return `<pre style="color: var(--vscode-terminal-ansiGreen);">${message}</pre>`;
        },
        step: (message: string): string => {
            return `<pre><span style="color: var(--vscode-terminal-ansiBlue);">${message.split(` `)[0]}</span> <span style="color: var(--vscode-terminal-ansiBrightBlue);">${message.split(` `).slice(1).join(` `)}</span></pre>`;
        },
    };

    /**
     * Add a new log type to the console, used by the commands for easy customization.
     * @param typeName the name of the type to reference it in the log method.
     * @param type A function that returns the formatted message. It receives the message and an optional args object containing possible extra information.
     */
    public addLogType = (typeName: string, type: (message: string, args?: {}) => string) => {
        this._logTypes[typeName] = type;
    };

    /**
     * Custom method to stylize strings declared as console commands (es: npm install)
     * @param message The message to format.
     * @returns {string} The formatted message.
     */
    private consoleCommandFormat = (message: string): string => {

        // Highlight parameters (es: --depth=0 => --depth and 0 are highlighted)
        let formattedMessage = message.replace(/(--[a-zA-Z0-9-]+)=([a-zA-Z0-9-]+)/g, (match, p1, p2) => {
            return `<span style="color: var(--vscode-terminal-ansiYellow)">${p1}</span>=<span style="color: var(--vscode-terminal-ansiGreen)">${p2}</span>`;
        });

        // Highlight the command
        formattedMessage = formattedMessage.replace(/(npm\s[a-zA-Z0-9-]+)/g, (match) => {
            return `<span style="color: var(--vscode-terminal-ansiGreen)">${match}</span>`;
        });

        return `<pre>${formattedMessage}</pre>`;
    };

    /**
     * Format links in the message to be clickable.
     * @param text The message to format.
     * @returns {string} The formatted message.
     */
    private formatLinks = (text: string): string => {
        // Replace every http or https link with a <a> tag if it's not already in an <a> tag
        let formattedText = text.replace(/(https?:\/\/[^\s<]+)/g, (match) => {
            if (/<a\s+(?:[^>]*?\s+)?href=("|')([^"']+)\1[^>]*>/.test(match)) {
                return match;
            } else {
                return `<a href="${match}" target="_blank">${match}</a>`;
            }
        });

        // Replace every local directory with a <a> tag if it's not already in an <a> tag
        formattedText = formattedText.replace(/((?:\s|^)[a-zA-Z]:[^\s<]+|(?:\s|^)\/[^\s<]+)/g, (match) => {
            if (/<a\s+(?:[^>]*?\s+)?href=("|')([^"']+)\1[^>]*>/.test(match)) {
                return match;
            } else {
                return ` <a href="file://${match.trim()}" onclick="openLocalLink('${match.trim()}')">${match.trim()}</a>`;
            }
        });

        return formattedText;
    };

    /**
     * Clear the console.
     */
    public clear = () => {
        this._log = ``;

        // Post message for the console
        FFConsole.webviewRef?.postMessage({
            command: `${this._categoryId}:${this._tabId}:log`,
            content: this._log
        });
    };

    /**
     * Log a message to the console.
     * @param message The message to log.
     * @param type The type of the message (plain, code, consoleCommand, alert, error, success, step...).
     */
    public log = (message: string, type: string = `plain`) => {
        if (!Object.keys(this._logTypes).includes(type)) {
            type = `plain`;
        }

        this._log += this.formatLinks(this._logTypes[type](message));

        FFConsole.webviewRef?.postMessage({
            command: `${this._categoryId}:${this._tabId}:log`,
            content: this._log
        });
    };
}