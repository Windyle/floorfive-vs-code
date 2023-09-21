import { KBS6_LIB_LISTENERS_SCRIPT, KBS6_LIB_SCRIPTS } from "./scripts/kbs6-lib.scripts";

export const JS: string = `
const vscode = acquireVsCodeApi();

${KBS6_LIB_SCRIPTS}

// ==== MESSAGE HANDLER ====

window.addEventListener('message', event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        ${KBS6_LIB_LISTENERS_SCRIPT}
    }
});
`;