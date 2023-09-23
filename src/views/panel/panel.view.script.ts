import { Modules } from "../../modules/_index";

export class PanelViewScript {

    public static getScript = (): string => {

        const firstModuleId: string = Object.keys(Modules.getModules())[0];
        const firstModuleFirstCommandId: string = Object.keys(Modules.getModule(firstModuleId).commands)[0];

        const panels: string = `
// ==== PANELS ====

var activePanel = "${Modules.getModule(firstModuleId)}:${firstModuleFirstCommandId}";
var panels = {
    ${Modules.getModulesArray().map((module: any) => {
            if (module.show()) {
                return `'${module.getId()}': {
                    ${module.getCommandsArray().map((command: any) => {
                    if (command.show()) {
                        return `'${command.getId()}': ''`;
                    }
                }).join(',\n')}
                }`;
            }
        }).join(',\n')
            }
};
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
            setActivePanelContent(categoryId, categoryTabs[tab].id);
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

            setActivePanelContent(categoryId, tab.getAttribute('name'));
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
    // Clear active panel content
    panels[activePanel.split(':')[0]][activePanel.split(':')[1]] = '';

    setActivePanelContent(activePanel.split(':')[0], activePanel.split(':')[1]);
});
`;

        const formatLinks: string = `
// ==== FORMAT LINKS ====

function formatLinks() {

    var consolePanel = document.getElementById('console-panel');
    var consolePanelText = consolePanel.innerHTML;

    vscode.postMessage({
        command: 'format-links',
        text: consolePanelText,
        activePanel: activePanel
    });

}
`;

        const setActivePanelContent: string = `
// ==== SET ACTIVE PANEL CONTENT ====

function setActivePanelContent(categoryId, tabId, execFormatLinks = true) {
    activePanel = \`\${categoryId}:\${tabId}\`;

    document.getElementById('console-panel').innerHTML = panels[categoryId][tabId];

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

    if(execFormatLinks) {
        formatLinks();
    }
}
`;

        const messageHandler: string = `
// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'clear-log':
            panels[message.categoryId][message.tabId] = '';
            
            if(activePanel === \`\${message.categoryId}:\${message.tabId}\`) {
                setActivePanelContent(message.categoryId, message.tabId);
            }
            
        break;
        case 'format-links:response':
            panels[message.activePanel.split(':')[0]][message.activePanel.split(':')[1]] = message.text;

            if(activePanel === message.activePanel) {
                setActivePanelContent(message.activePanel.split(':')[0], message.activePanel.split(':')[1], false);
            }
        break;
        ${Modules.getModulesArray().map((module: any) => {
            if (module.show()) {
                return module.getCommandsArray().map((command: any) => {
                    if (command.show()) {
                        return command.getLogScript();
                    }
                }).join('\n');
            }
        }).join('\n')
            }
    }
});
`;

        return `
var vscode = acquireVsCodeApi();

hljs.highlightAll();

${panels}

${categories}

${tabs}

${sidebarCollapse}

${clearConsole}

${formatLinks}

${setActivePanelContent}

${messageHandler}
`;

    };
}