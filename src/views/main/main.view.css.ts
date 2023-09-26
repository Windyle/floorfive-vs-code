export const CSS: string = `
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

icon, label {
    cursor: pointer;
}

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

.container h1 {
  width: 100%;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--vscode-editor-foreground);
  user-select: none;
}

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

@media screen and (min-width: 420px) {
    .btns-container {
        grid-template-columns: 1fr 1fr;
    }

    .btns-container h2,
    button.btn-span-2 {
        grid-column: 1 / span 2;
    }
}

@media screen and (min-width: 620px) {
    .btns-container {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .btns-container h2 {
        grid-column: 1 / span 3;
    }

    .command-button.btn-span-2 {
        grid-column: 1 / span 1;
    }
}

@media screen and (min-width: 950px) {
    .btns-container {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .btns-container h2 {
        grid-column: 1 / span 4;
    }

    .command-button.btn-span-2 {
        grid-column: 1 / span 1;
    }
}

.command-button {
  background-color: var(--vscode-button-background);
  border: none;
  color: var(--vscode-button-foreground);
  width: 100%;
  height: 30px;
  border-radius: 5px;
  cursor: pointer;
}

.command-button:has(svg.flip) {
    background-color: var(--vscode-inputValidation-warningBorder) !important;
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

/* ==== MODAL ==== */

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