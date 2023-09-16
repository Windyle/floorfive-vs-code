export const JS: string = `
const vscode = acquireVsCodeApi();

// ==== TABS ====
var tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(tab => tab.classList.remove('active'));
        tab.classList.add('active');
    });
});

// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
    }
});
`;