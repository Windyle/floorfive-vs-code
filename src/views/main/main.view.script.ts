import { Modules } from "../../modules/modules.index";

export class MainViewScript {

    public static getScript = (): string => {

        const scripts = Modules.getModulesArray().map((module: any) => {
            if (module.show()) {
                return Object.keys(module.commands).map((commandId: string) => {
                    const command = module.commands[commandId];
                    if (command.show()) {
                        return command.getScript();
                    }
                }).join(`\n`);
            }
        }).join(`\n`);

        const listenersScripts = Modules.getModulesArray().map((module: any) => {
            if (module.show()) {
                return Object.keys(module.commands).map((commandId: string) => {
                    const command = module.commands[commandId];
                    if (command.show()) {
                        return command.getListenerScript();
                    }
                }).join(`\n`);
            }
        }).join(`\n`);

        const isExecutingListenerScript = `
case '@is-executing:listener':
    console.log('is-executing:listener', message);
    setExecutingById(message.moduleId + '-' + message.commandId, message.icon, message.label);
    break;
        `;

        return `
const vscode = acquireVsCodeApi();

// ==== SCRIPTS ====

// Collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {

        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }

        var j;
        for (j = 0; j < coll.length; j++) {
            if (coll[j] != this) {
                coll[j].classList.remove("active");
                var content = coll[j].nextElementSibling;
                content.style.maxHeight = null;
            }
        }

    });
}

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

function setExecutingById(id, icon, label) {
    var element = document.getElementById(id);

    setExecuting(element, icon, label);
}

vscode.postMessage({
    command: '@is-executing:check'
});

${scripts}

// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        ${isExecutingListenerScript}
        ${listenersScripts}
    }
});
            `;
    };
}