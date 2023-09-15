import { ANGULAR_DEVELOPMENT_LISTENERS_SCRIPT, ANGULAR_DEVELOPMENT_SCRIPTS } from "./scripts/angular-development.scripts";

export const JS: string = `
const vscode = acquireVsCodeApi();

${ANGULAR_DEVELOPMENT_SCRIPTS}

// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        ${ANGULAR_DEVELOPMENT_LISTENERS_SCRIPT}
    }
});
`;