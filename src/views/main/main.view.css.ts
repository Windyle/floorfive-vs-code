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

.collapsible.settings icon {
    margin-right: 10px;
}

.collapsible.settings icon svg {
    width: 20px;
    height: 20px;
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

h1 {
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

.command-button:hover {
  opacity: 0.9;
}

.command-button:active {
  opacity: 0.8;
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
`;