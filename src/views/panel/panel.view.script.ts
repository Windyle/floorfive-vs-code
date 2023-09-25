import { Modules } from "../../modules/modules.index";

export class PanelViewScript {

    public static getScript = (): string => {

        const firstModuleId: string = Object.keys(Modules.getModules())[0];
        const firstModuleFirstCommandId: string = Object.keys(Modules.getModule(firstModuleId).commands)[0];

        const activePanel: string = `
// ==== ACTIVE PANEL ====

var activePanel = "${Modules.getModule(firstModuleId)}:${firstModuleFirstCommandId}";
`;

        const categories: string = `
// ==== CATEGORIES ====
var categoriesBtns = document.querySelectorAll('#categories-bar button');

categoriesBtns.forEach(btn => {
    if(btn.id !== 'sidebar-collapse') {
        btn.id === '${Modules.getModule(firstModuleId).getId()}' ? btn.classList.add('active') : '';

        btn.addEventListener('click', () => {
            categoriesBtns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');

            setTabs(btn.id);
        });
    }
});
`;

        const tabs: string = `
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

function setTabs(categoryId = '${Modules.getModule(firstModuleId).getId()}') {
    var tabsBar = document.getElementById('tabs-bar');

    var categoryTabs = tabsList[categoryId];

    var tabsBarContent = '';
    for (const tab of Object.keys(categoryTabs)) {
        var firstTab = false;
        
        // Set first tab as active
        if(tab === Object.keys(categoryTabs)[0]) {
            setActivePanel(categoryId, categoryTabs[tab].id);
            firstTab = true;
        }

        tabsBarContent += \`<div class="tab \${firstTab ? 'active' : ''}" name="\${categoryTabs[tab].id}">\${categoryTabs[tab].label}</div>\`;
    }

    tabsBar.innerHTML = tabsBarContent;

    var tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(tab => tab.classList.remove('active'));
            tab.classList.add('active');

            setActivePanel(categoryId, tab.getAttribute('name'));
        });
    });
}

setTabs();
`;

        const sidebarCollapse: string = `
// ==== SIDEBAR COLLAPSE ====

var sidebarCollapseBtn = document.getElementById('sidebar-collapse');

sidebarCollapseBtn.addEventListener('click', function() {
    sidebarCollapseBtn.classList.toggle('collapsed');

    var container = document.querySelector('.container');
    container.classList.toggle('collapsed');
});
`;

        const clearConsole: string = `
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

        const setActivePanel: string = `
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

// Set active panel on load (first module, first command)
setActivePanel('${Modules.getModule(firstModuleId).getId()}', '${firstModuleFirstCommandId}');
`;

        const openLocalLink: string = `
// ==== OPEN LOCAL LINK ====

function openLocalLink(path) {
    vscode.postMessage({
        command: "open-local-link",
        path: path
    });
}
        `;

        const messageHandler: string = `
// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'set-active-panel:response':
            setActivePanelContent(message.content);
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

        return `
var vscode = acquireVsCodeApi();

hljs.highlightAll();

${activePanel}

${categories}

${tabs}

${sidebarCollapse}

${clearConsole}

${setActivePanel}

${openLocalLink}

${messageHandler}
`;

    };
}