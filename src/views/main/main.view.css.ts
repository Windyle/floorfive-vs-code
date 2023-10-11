export const CSS: string = `
/* Base Styles */

body {
    padding: 0 5px;
}

.container {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    overflow-y: auto;
    padding: 15px;
    box-sizing: border-box;
}

.container::-webkit-scrollbar {
    width: 2px;
}

icon,
label {
    cursor: pointer;
}

/* Collapsible Section Styles */

.collapsible {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    cursor: pointer;
    border-radius: 5px;
    padding: 0 10px;
}

.collapsible:first-child {
    margin-top: 10px;
}

.collapsible.settings {
    margin-top: 30px;
}

.collapsible icon {
    margin-right: 10px;
}

.collapsible icon svg {
    width: 18px;
    height: 18px;
}

.collapsible:hover {
    background-color: var(--vscode-menu-background);
}

.chevron-arrow {
    display: inline-block;
    border-right: 2px solid var(--vscode-editor-foreground);
    border-bottom: 2px solid var(--vscode-editor-foreground);
    width: 6px;
    height: 6px;
    transform: rotate(-45deg) translate(-4px, -2px);
    transition: transform 0.2s ease-out;
}

.collapsible.active .chevron-arrow {
    transform: rotate(45deg) translate(-4px, 0px);
}

/* Header Styles */

.container h1 {
    width: 100%;
    font-size: 12px;
    text-transform: uppercase;
    color: var(--vscode-editor-foreground);
    user-select: none;
}

/* Button Container Styles */

.btns-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
    padding: 0;
    transition: max-height 0.2s ease-out, padding 0.001s 0.2s ease-out;
    max-height: 0;
    background-color: var(--vscode-editor-background);
    overflow: hidden;
    border-radius: 5px;
}

.collapsible.active + .btns-container {
    padding: 10px !important;
    transition: max-height 0.2s ease-out;
}

.btns-container h2 {
    font-size: 12px;
    color: var(--vscode-editor-foreground);
    height: 12px;
    margin: 0;
    user-select: none;
}

/* Command Button Styles */

.command-button {
    background-color: var(--vscode-button-background);
    border: none;
    color: var(--vscode-button-foreground);
    width: 100%;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
}

.command-button.sub {
    width: 85%;
    margin-right: 0;
    margin-left: auto;
    filter: saturate(0.5);
}

.command-button:has(svg.flip) {
    background-color: var(--vscode-button-background) !important;
    filter: hue-rotate(60deg) brightness(1.22);
}

.command-button:hover {
    opacity: 0.9;
}

.command-button:active {
    opacity: 0.8;
}

.command-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.command-button.icon-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 0 10px;
    position: relative;
}

.command-button.icon-button icon svg {
    width: 20px;
    height: 20px;
}

/* Modal Styles */

#modal-overlay {
    z-index: 4;
    display: none;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: var(--vscode-editor-background);
    opacity: 0.5;
}

#modal-overlay.show {
    display: block !important;
}

#modal {
    z-index: 5;
    display: none;
    width: 85vw;
    max-height: 50vh;
    background: var(--vscode-editor-background);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    border: 1px solid var(--vscode-activityBar-border);
    padding: 20px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    box-shadow: 0 5px 15px 0 var(--vscode-inputOption-activeBackground);
}

#modal.show {
    display: flex !important;
}

#modal-title {
    font-size: 20px;
    color: var(--vscode-editor-foreground);
    font-weight: bold;
    text-align: center;
}

#modal-description {
    font-size: 16px;
    color: var(--vscode-editor-foreground);
    text-align: center;
}

#modal-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 30px;
    padding: 0 20px;
}

#modal-actions button {
    border: none;
    color: var(--vscode-button-foreground);
    flex-grow: 1;
    margin: 0 5px;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
}

#modal-actions button:hover {
    opacity: 0.9;
}

#modal-actions button:active {
    opacity: 0.8;
}

#modal-actions button.primary {
    background-color: var(--vscode-button-background);
}

#modal-actions button.secondary {
    background-color: transparent;
    border: 1px solid var(--vscode-button-background);
}

`;