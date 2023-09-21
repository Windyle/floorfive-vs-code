import { ConsoleCategories } from "../../core/enums/console-categories";
import { ConsoleTabs } from "../../core/enums/console-tabs";

const panels: string = `
// ==== PANELS ====

var activePanel = "${ConsoleCategories.angularDeploy}:${ConsoleTabs[ConsoleCategories.angularDeploy][`deploy`].id}";
var panels = {
    "${ConsoleCategories.angularDeploy}": {
        "${ConsoleTabs[ConsoleCategories.angularDeploy][`deploy`].id}": "deploy",
    },
    "${ConsoleCategories.kbs6Lib}": {
        "${ConsoleTabs[ConsoleCategories.kbs6Lib][`installLatest`].id}": "install latest",
        "${ConsoleTabs[ConsoleCategories.kbs6Lib][`compareVersions`].id}": "compare versions",
        "${ConsoleTabs[ConsoleCategories.kbs6Lib][`publish`].id}": "publish",
    },
    "${ConsoleCategories.lint}": {
        "${ConsoleTabs[ConsoleCategories.lint][`lint`].id}": "lint",
    },
    "${ConsoleCategories.kbsMobile}": {
        "${ConsoleTabs[ConsoleCategories.kbsMobile][`setEnvironment`].id}": "set environment",
        "${ConsoleTabs[ConsoleCategories.kbsMobile][`incrementVersion`].id}": "increment version",
        "${ConsoleTabs[ConsoleCategories.kbsMobile][`configurationsRoutes`].id}": "configurations routes",
        "${ConsoleTabs[ConsoleCategories.kbsMobile][`entitiesPropertiesList`].id}": "entities properties list",
        "${ConsoleTabs[ConsoleCategories.kbsMobile][`globalVariables`].id}": "global variables",
    }
};
`;

const categories: string = `
// ==== CATEGORIES ====
var categoriesBtns = document.querySelectorAll('#categories-bar button');

categoriesBtns.forEach(btn => {
    btn.id === '${ConsoleCategories.angularDeploy}' ? btn.classList.add('active') : '';

    btn.addEventListener('click', () => {
        categoriesBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        setTabs(btn.id);
    });
});
`;

export const tabs: string = `
// ==== TABS ====

var tabsList = ${JSON.stringify(ConsoleTabs)};

function setTabs(categoryId = '${ConsoleCategories.angularDeploy}') {
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
    }
});
`;

export const JS: string = `
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