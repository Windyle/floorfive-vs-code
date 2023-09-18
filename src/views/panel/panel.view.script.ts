import { ANGULAR_DEVELOPMENT_LOG_SCRIPTS } from "./scripts/angular-development.log-scripts";

export const JS: string = `
var vscode = acquireVsCodeApi();

// ==== PANELS ====

var activePanel = {{activePanel}};
var panels = {{panels}};

// ==== TABS ====
var tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(tab => tab.classList.remove('active'));
        tab.classList.add('active');
    });
});

// ==== MESSAGE HANDLER ====

function setActivePanelContent(categoryId, tabId) {
    document.getElementById('console-panel').innerHTML = panels[categoryId][tabId];

    // Scroll to bottom if the scroll is already at the bottom (or close to it) or if no scroll is active
    var consoleSection = document.getElementById('console-section');
    if (consoleSection.scrollTop + consoleSection.clientHeight >= consoleSection.scrollHeight - 50 || consoleSection.scrollTop === 0) {
        consoleSection.scrollTop = consoleSection.scrollHeight;

        // Scroll to bottom again after 100ms to make sure the scroll is at the bottom
        setTimeout(() => {
            consoleSection.scrollTop = consoleSection.scrollHeight;
        }, 100);
    }
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