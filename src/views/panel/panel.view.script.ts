export const JS: string = `
const vscode = acquireVsCodeApi();

// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
    }
});
`;