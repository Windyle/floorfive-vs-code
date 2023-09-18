import { ANGULAR_DEVELOPMENT_LOG_SCRIPTS } from "./scripts/angular-development.log-scripts";

export const JS: string = `
var vscode = acquireVsCodeApi();

hljs.highlightAll();

// ==== PANELS ====

var activePanel = {{activePanel}};
var panels = {{panels}};

// ==== TABS ====
var tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(tab => tab.classList.remove('active'));
        tab.classList.add('active');

        setActivePanelContent('angular', tab.getAttribute('name'));
    });
});

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