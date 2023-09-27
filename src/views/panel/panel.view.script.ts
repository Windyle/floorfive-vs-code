import { Modules } from "../../modules/modules.index";

/**
 * Represents the main script part for the panel view webview.
 */
export class PanelViewScript {

    /**
     * Categories buttons event listeners initialization for switching between categories.
     * The categories are generated dynamically based on the modules.
     */
    private categories: string = `
// ==== CATEGORIES ====
var categoriesBtns = document.querySelectorAll('#categories-bar button');

categoriesBtns.forEach(btn => {
    if(btn.id !== 'sidebar-collapse') {
        btn.addEventListener('click', () => {
            categoriesBtns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');

            setTabs(btn.id);
        });
    }
});
    `;

    /**
     * Tabs event listeners initialization for switching between tabs of a given category.
     * The tabs are generated dynamically based on the commands of the modules.
     */
    private tabs: string = `
// ==== TABS ====

var tabsList = ${JSON.stringify(
        Modules.getModulesArray().reduce((acc: any, module: any) => {
            if (module.show()) {
                acc[module.getId()] = module.getCommandsArray().reduce((acc: any, command: any) => {
                    if (command.show()) {
                        acc[command.getId()] = {
                            id: command.getId(),
                            label: command.getLabel()
                        };
                    }
                    return acc;
                }, {});
            }
            return acc;
        }, {})
    )};

var tabs;

function setTabs(categoryId = '') {
    var tabsBar = document.getElementById('tabs-bar');

    var categoryTabs = tabsList[categoryId];

    var tabsBarContent = '';
    for (const tab of Object.keys(categoryTabs)) {
        tabsBarContent += \`<div class="tab" name="\${categoryTabs[tab].id}">\${categoryTabs[tab].label}</div>\`;
    }

    tabsBar.innerHTML = tabsBarContent;

    tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(tab => tab.classList.remove('active'));
            tab.classList.add('active');

            setActivePanel(categoryId, tab.getAttribute('name'));
        });
    });
}
`;

    /**
     * Sidebar collapse button event listener initialization for collapsing the sidebar containing the categories buttons.
     */
    private sidebarCollapse: string = `
// ==== SIDEBAR COLLAPSE ====

var sidebarCollapseBtn = document.getElementById('sidebar-collapse');

sidebarCollapseBtn.addEventListener('click', function() {
    sidebarCollapseBtn.classList.toggle('collapsed');

    var container = document.querySelector('.container');
    container.classList.toggle('collapsed');
});
`;

    /**
     * Clear console button event listener initialization for clearing the console panel manually.
     */
    private clearConsole: string = `
// ==== CLEAR CONSOLE ====

var clearConsoleBtn = document.getElementById('clear-console');

clearConsoleBtn.addEventListener('click', function() {
    vscode.postMessage({
        command: 'clear-log',
        moduleId: activePanel.split(':')[0],
        commandId: activePanel.split(':')[1]
    });
});
`;

    /**
     * Set active panel function for setting the active panel content and the active panel id.
     * Also, it sends a first message on load to get the active panel id from the view.
     */
    private setActivePanel: string = `
// ==== SET ACTIVE PANEL CONTENT ====

function setActivePanel(categoryId, tabId) {
    activePanel = \`\${categoryId}:\${tabId}\`;

    vscode.postMessage({
        command: "set-active-panel",
        moduleId: categoryId,
        commandId: tabId
    });
}

function setActivePanelContent(content) {
    document.getElementById('console-panel').innerHTML = content;

    // Scroll to bottom if the scroll is already at the bottom (or close to it) or if no scroll is active
    var consolePanel = document.getElementById('console-panel');
    if (consolePanel.scrollTop + consolePanel.clientHeight >= consolePanel.scrollHeight - 50 || consolePanel.scrollTop === 0) {
        consolePanel.scrollTop = consolePanel.scrollHeight;

        // Scroll to bottom again after 100ms to make sure the scroll is at the bottom
        setTimeout(() => {
            consolePanel.scrollTop = consolePanel.scrollHeight;
        }, 100);
    }

    hljs.highlightAll();
}

function getActivePanelFromView() {
    vscode.postMessage({
        command: "set-active-panel:onload"
    });
}

getActivePanelFromView();
`;

    /**
     * Go to active panel function for switching between panels programmatically.
     */
    private goToActivePanel: string = `
// ==== GO TO ACTIVE PANEL ====

function goToActivePanel(moduleId, commandId) {

    for (const btn of categoriesBtns) {
        if(btn.id === moduleId && !btn.classList.contains('active')) {
            btn.click();
            break;
        }
    }

    for (const tab of tabs) {
        if(tab.getAttribute('name') === commandId) {
            tab.classList.add('active');
        }
        else {
            tab.classList.remove('active');
        }
    }

    setActivePanel(moduleId, commandId);
}
        `;

    /**
     * Open local link function for sending a message to the extension to open a local link in the editor.
     */
    private openLocalLink: string = `
// ==== OPEN LOCAL LINK ====

function openLocalLink(path) {
    vscode.postMessage({
        command: "open-local-link",
        path: path
    });
}
        `;

    /**
     * Copy console button event listener initialization for copying the console panel content to the clipboard.
     */
    private copyConsole: string = `
// ==== COPY CONSOLE ====

document.getElementById('copy-console').addEventListener('click', () => {

    const text = document.getElementById('console-panel').innerText;

    navigator.clipboard.writeText(text).then(() => {
        vscode.postMessage({
            command: "show-info",
            content: "Copied to clipboard!"
        });
    }, () => {
        vscode.postMessage({
            command: "show-simple-error",
            content: "Failed to copy to clipboard!"
        });
    });

});
        `;

    /**
     * Set output panel theme function for setting the stylesheet of the output panel.
     */
    private setOutputPanelTheme: string = `
// ==== SET OUTPUT PANEL THEME ====

function setOutputPanelTheme(theme) {
    // Change the href of the stylesheet
    document.querySelector('link[href*="highlight.js"]').href = \`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/\${theme}.min.css\`;
}

function getCurrentTheme() {
    vscode.postMessage({
        command: "update-output-panel-theme:current"
    });
}

getCurrentTheme();
        `;

    /**
     * Message handler for handling messages from the extension to the view.
     */
    private messageHandler: string = `
// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'set-active-panel:response':
            setActivePanelContent(message.content);
            break;
        case 'set-active-panel:goto':
            goToActivePanel(message.moduleId, message.commandId);
            break;
        case 'update-output-panel-theme':
            setOutputPanelTheme(message.theme);
            break;
        ${Modules.getModulesArray().map((module: any) => {
        if (module.show()) {
            return module.getCommandsArray().map((command: any) => {
                if (command.show()) {
                    return command.getLogScript();
                }
            }).join(`\n`);
        }
    }).join(`\n`)
        }
    }
});
`;

    /**
     * Get the script for the panel view.
     */
    public getScript = (): string => {
        return `
var vscode = acquireVsCodeApi();
var activePanel = '';

hljs.highlightAll();

${this.categories}

${this.tabs}

${this.sidebarCollapse}

${this.clearConsole}

${this.setActivePanel}

${this.goToActivePanel}

${this.openLocalLink}

${this.copyConsole}

${this.setOutputPanelTheme}

${this.messageHandler}
`;
    };
}