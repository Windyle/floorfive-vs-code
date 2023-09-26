// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { Views } from './views/_index';
import { Modules } from './modules/modules.index';
import { Store } from './store';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Set the context
    Store.extensionContext = context;

    // Register modules
    Modules.setModules();

    // Get disposables and push to subscriptions
    Modules.getModulesArray().forEach((module: any) => {
        module.getCommandsArray().forEach((command: any) => {
            if (command.show() && command.showOnCommandPalette) {
                const commandName = `floorfive-vs-code.${command.getModule()}.${command.getId()}`;
                let disposable = vscode.commands.registerCommand(commandName, () => {
                    command.execute();
                });

                console.log(`Registering command: ${commandName}`);

                context.subscriptions.push(disposable);
            }
        });
    });

    // Register the views
    Views.activateAll(context);

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(`Congratulations, your extension "floorfive-vs-code" is now active!`);
}

// This method is called when your extension is deactivated
export function deactivate() { }
