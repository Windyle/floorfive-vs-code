import { ConsoleCategories } from "../../core/enums/console-categories";
import { ConsoleTabs } from "../../core/enums/console-tabs";
import { ANGULAR_DEVELOPMENT_LOG_SCRIPTS } from "./scripts/angular-development.log-scripts";

export const JS: string = `
var vscode = acquireVsCodeApi();

hljs.highlightAll();

// ==== PANELS ====

var activePanel = "${ConsoleCategories.angularDevelopment}:${ConsoleTabs[ConsoleCategories.angularDevelopment][`serve`].id}";
var panels = {
    "${ConsoleCategories.angularDevelopment}": {
        "${ConsoleTabs[ConsoleCategories.angularDevelopment][`serve`].id}": "serve",
        "${ConsoleTabs[ConsoleCategories.angularDevelopment][`build`].id}": "build",
        "${ConsoleTabs[ConsoleCategories.angularDevelopment][`test`].id}": "test",
        "${ConsoleTabs[ConsoleCategories.angularDevelopment][`buildWatch`].id}": "build watch"
    },
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

// ==== CATEGORIES ====

var categoriesBtns = document.querySelectorAll('#categories-bar button');

categoriesBtns.forEach(btn => {
    btn.id === 'angular' ? btn.classList.add('active') : '';

    btn.addEventListener('click', () => {
        categoriesBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        setTabs(btn.id);
    });
});

// ==== TABS ====

var tabsList = ${JSON.stringify(ConsoleTabs)};

function setTabs(categoryId = 'angular') {
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

// ==== MESSAGE HANDLER ====

function setActivePanelContent(categoryId, tabId) {
    console.log('setActivePanelContent', categoryId, tabId);

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
}

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'clear-log':
            panels[message.categoryId][message.tabId] = '';
            
            if(activePanel === \`\${message.categoryId}:\${message.tabId}\`) {
                setActivePanelContent(message.categoryId, message.tabId);
            }
            
            break;
        ${ANGULAR_DEVELOPMENT_LOG_SCRIPTS}
    }
});
`;