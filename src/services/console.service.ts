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
    public static webviewRef: vscode.Webview | undefined;

    constructor(categoryId: string, tabId: string, defaultLanguage: HighlightLanguages) {
        this._categoryId = categoryId;
        this._tabId = tabId;
        this._defaultLanguage = defaultLanguage;
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
        FFConsole.webviewRef?.postMessage({
            command: `clear-log`,
            categoryId: this._categoryId,
            tabId: this._tabId
        });
    };

    public log = (message: string, isCode: boolean = false, language?: HighlightLanguages) => {

        // Set default language
        language = language ? language : this._defaultLanguage;

        // Post message for the console
        FFConsole.webviewRef?.postMessage({
            command: `${this._categoryId}:${this._tabId}:log`,
            content: message,
            isCode: isCode,
            language: language
        });
    };
}