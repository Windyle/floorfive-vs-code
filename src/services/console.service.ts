import * as vscode from "vscode";

import { HighlightLanguages } from "../core/enums/highlight-languages";

export class ConsoleInstantiator {

    public static instances = new Map<string, FFConsole>();

    public static instantiate = (categoryId: string, tabId: string, defaultLanguage: HighlightLanguages = HighlightLanguages.plaintext) => {
        const instance = new FFConsole(categoryId, tabId, defaultLanguage);
        ConsoleInstantiator.instances.set(`${categoryId}:${tabId}`, instance);

        return instance;
    };

    public static getInstance = (categoryId: string, tabId: string): FFConsole | undefined => {
        return ConsoleInstantiator.instances.get(`${categoryId}:${tabId}`);
    };
}

export class FFConsole {

    private _categoryId: string;
    private _tabId: string;
    private _defaultLanguage: HighlightLanguages;
    private _log: string = ``;
    public static webviewRef: vscode.Webview | undefined;

    constructor(categoryId: string, tabId: string, defaultLanguage: HighlightLanguages) {
        this._categoryId = categoryId;
        this._tabId = tabId;
        this._defaultLanguage = defaultLanguage;
    };

    // Log Methods

    private _logMethods: { [method: string]: any } = {
        plain: (message: string): string => {
            return `<pre>${message}</pre>`;
        },
        code: (message: string, language?: HighlightLanguages): string => {
            language = language ? language : this._defaultLanguage;
            return `<pre><code class="language-${language}">${message}</code></pre>`;
        },
        consoleCommand: (message: string): string => {
            return this.consoleCommandFormat(message);
        },
        error: (message: string): string => {
            return `<pre style="color: var(--vscode-terminal-ansiRed);">${message}</pre>`;
        },
        success: (message: string): string => {
            return `<pre style="color: var(--vscode-terminal-ansiGreen);">${message}</pre>`;
        },
    };

    public addLogMethod = (type: string, method: (message: string, config?: {}) => string) => {
        this._logMethods[type] = method;
    };

    // Format Methods

    private consoleCommandFormat = (message: string): string => {

        // Highlight parameters (es: --depth=0 => --depth and 0 are highlighted)
        let formattedMessage = message.replace(/(--[a-zA-Z0-9-]+)=([a-zA-Z0-9-]+)/g, (match, p1, p2) => {
            return `<span style="color: var(--vscode-terminal-ansiYellow)">${p1}</span>=<span style="color: var(--vscode-terminal-ansiGreen)">${p2}</span>`;
        });

        // Highlight the command
        formattedMessage = formattedMessage.replace(/(npm\s[a-zA-Z0-9-]+)/g, (match) => {
            return `<span style="color: var(--vscode-terminal-ansiGreen)">${match}</span>`;
        });

        return `<pre style="display: flex;">${formattedMessage}</pre>`;
    };

    // Static methods

    public static formatLinks = (text: string): string => {
        // Replace every link with a <a> tag if it's not already in an <a> tag
        const formattedText = text.replace(/(https?:\/\/[^\s<]+)/g, (match) => {
            // Check if the match is already inside an <a> tag
            if (/<a\s+(?:[^>]*?\s+)?href=("|')([^"']+)\1[^>]*>/.test(match)) {
                // Return the match as is if it's already in an <a> tag
                return match;
            } else {
                // Wrap the match in an <a> tag
                return `<a href="${match}" target="_blank">${match}</a>`;
            }
        });

        return formattedText;
    };

    // Public methods

    public clear = () => {
        this._log = ``;

        // Post message for the console
        FFConsole.webviewRef?.postMessage({
            command: `${this._categoryId}:${this._tabId}:log`,
            content: this._log
        });
    };

    public log = (message: string, type: string = `plain`, language?: HighlightLanguages) => {

        if (!Object.keys(this._logMethods).includes(type)) {
            type = `plain`;
        }

        // Post message for the console
        FFConsole.webviewRef?.postMessage({
            command: `${this._categoryId}:${this._tabId}:log`,
            content: this._log += this._logMethods[type](message, language)
        });
    };
}