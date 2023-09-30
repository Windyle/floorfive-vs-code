import { Modules } from "../../modules/modules.index";

/**
 * Represents the main script part for the panel view webview.
 */
export class MainViewScript {

    /**
     * Retrieve commands front end execution scripts for each module.
     */
    private commandsScripts: string = Modules.getModulesArray().map((module: any) => {
        if (module.show()) {
            return Object.keys(module.commands).map((commandId: string) => {
                const command = module.commands[commandId];
                if (command.show()) {
                    return command.getScript();
                }
            }).join(`\n`);
        }
    }).join(`\n`);

    /**
     * Retrieve commands front end listeners scripts for each module.
     */
    private commandsListenersScripts: string = Modules.getModulesArray().map((module: any) => {
        if (module.show()) {
            return Object.keys(module.commands).map((commandId: string) => {
                const command = module.commands[commandId];
                if (command.show()) {
                    return command.getListenerScript();
                }
            }).join(`\n`);
        }
    }).join(`\n`);

    /**
     * Listener for the core is-executing:listener command.
     */
    private isExecutingListener: string = `
case '@is-executing:listener':
    var element = document.getElementById(message.moduleId + '-' + message.commandId);
    setExecuting(element, message.icon, message.label);
    break;
        `;

    /**
     * Modal management script.
     * Show, dismiss and execute modal actions.
     */
    private modal: string = `
// ==== MODAL ====

var canDismissModal = true;

var modal = document.getElementById("modal");
var modalOverlay = document.getElementById("modal-overlay");
var modalTitle = document.getElementById("modal-title");
var modalDescription = document.getElementById("modal-description");
var modalActions = document.getElementById("modal-actions");

function showModal(title, content, actions, canDismiss = true) {

    canDismissModal = canDismiss;

    modalTitle.innerHTML = title;
    modalDescription.innerHTML = content;
    
    var actionsHtml = '';
    actions.forEach(action => {
        actionsHtml += '<button id="modal-' + action.module + ':' + action.command + ':' + action.id + '" class="' + action.class + '">' + action.label + '</button>';
    });
    modalActions.innerHTML = actionsHtml;

    document.querySelectorAll('#modal-actions button').forEach(button => {
        button.addEventListener('click', function() {
            var [module, command, id] = this.id.split(':');
            vscode.postMessage({
                command:'@modal-action',
                moduleId: module.replace('modal-', ''),
                commandId: command,
                actionId: id
            });
        });
    });

    modalOverlay.removeEventListener("click", function() {});    
    modalOverlay.addEventListener("click", function() {
        if(canDismissModal) {
            var refAction = actions[0];
            vscode.postMessage({
                command:'@modal-action',
                moduleId: refAction.module,
                commandId: refAction.command,
                actionId: 'cancel'
            });
        }
    });

    modalOverlay.classList.add("show");
    modal.classList.add("show");
}

function dismissModal() {
    modalOverlay.classList.remove("show");
    modal.classList.remove("show");
}
        `;

    /**
     * Listener for the core @show-modal and @dismiss-modal commands, used for interacting with the modal from outside the webview.
     */
    private modalListener: string = `
case '@show-modal':
    showModal(message.title, message.content, message.actions, message.canDismiss);
    break;
case '@dismiss-modal':
    dismissModal();
    break;
        `;

    /**
     * Modules collapsible sections management script.
     * Used for collapsing and expanding the sections to show or hide the commands.
     */
    private collapsible: string = `
// ==== COLLAPSIBLE ====

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
        `;

    /**
     * Manage execution state of commands that can have a loading state.
     */
    private setExecuting: string = `
// ==== SET EXECUTING ====

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
        }, 2500);
    }
}

function stopExecutingById(id, icon, label) {
    var element = document.getElementById(id);

    if(element.querySelector('icon').getAttribute('name') === 'square') {
        setExecuting(element, icon, label);
    }
}

vscode.postMessage({
    command: '@is-executing:check'
});
        `;

    /**
     * Generate the script for the main view webview.
     * @returns {string} The script.
     */
    public getScript = (): string => {

        return `
const vscode = acquireVsCodeApi();

${this.collapsible}

${this.setExecuting}

${this.commandsScripts}

${this.modal}

// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        ${this.isExecutingListener}
        ${this.modalListener}
        ${this.commandsListenersScripts}
    }
});
            `;
    };
}