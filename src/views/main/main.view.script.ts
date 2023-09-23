import { Modules } from "../../modules/_index";

export class MainViewScript {

    public static getScript = (): string => {

        const scripts = Modules.getModulesArray().map((module: any) => {
            if (module.show()) {
                return Object.keys(module.commands).map((commandId: string) => {
                    const command = module.commands[commandId];
                    if (command.show()) {
                        return command.getScript();
                    }
                }).join('\n');
            }
        });

        const listenersScripts = Modules.getModulesArray().map((module: any) => {
            if (module.show()) {
                return Object.keys(module.commands).map((commandId: string) => {
                    const command = module.commands[commandId];
                    if (command.show()) {
                        return command.getListenerScript();
                    }
                }).join('\n');
            }
        });

        return `
const vscode = acquireVsCodeApi();

// ==== SCRIPTS ====

${scripts}

// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        ${listenersScripts}
    }
});
            `;
    };
}