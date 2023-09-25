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

function setExecuting(element, icon, label) {
    const iconTag = element.querySelector('icon');
    const iconName = iconTag.getAttribute('name');
    
    if(iconName === icon) {
        iconTag.setAttribute('name', 'square');
        iconTag.innerHTML = icons['square'];
        iconTag.querySelector('svg').classList.add('flip');
        element.querySelector('label').innerHTML = 'Stop ' + label;
    }
    else {
        iconTag.setAttribute('name', icon);
        iconTag.innerHTML = icons[icon];
        iconTag.querySelector('svg').classList.remove('flip');
        element.querySelector('label').innerHTML = label;

        element.classList.add('disabled');
        setTimeout(() => {
            element.classList.remove('disabled');
        }, 1500);
    }
}

function setExecutingById(element, icon, label) {
    var element = document.getElementById(element.id);

    setExecuting(element, icon, label);
}

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