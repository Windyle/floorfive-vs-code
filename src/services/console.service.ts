import * as vscode from "vscode";

import { HighlightLanguages } from "../core/enums/highlight-languages";

export class ConsoleInstantiator {

    public static instances = new Map<string, FFConsole>();

    public static instantiate = (categoryId: string, tabId: string, defaultLanguage: HighlightLanguages) => {
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

    public clear = () => {
        FFConsole.webviewRef?.postMessage({
            command: `clear-log`,
            categoryId: this._categoryId,
            tabId: this._tabId
        });
    };

    public log = (message: string, language?: HighlightLanguages) => {

        // Set default language
        language = language ? language : this._defaultLanguage;

        // Post message for the console
        FFConsole.webviewRef?.postMessage({
            command: `log-${this._categoryId}:${this._tabId}`,
            content: message,
            language: language
        });
    };
}