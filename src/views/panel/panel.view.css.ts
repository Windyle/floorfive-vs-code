export const CSS: string = `
html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.container {
    display: grid;
    grid-template-columns: 250px 1fr;
    width: 100vw;
    height: 100%;
    overflow: hidden;
}

.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    border-right: 1px solid var(--vscode-disabledForeground);
    padding: 15px;
}

.sidebar button {
    background-color: var(--vscode-button-background);
    border: none;
    color: var(--vscode-button-foreground);
    width: 100%;
    height: 30px;
    min-height: 30px;
    border-radius: 5px;
    cursor: pointer;
}

.main {
    display: grid;
    grid-template-rows: 30px 1fr;
    height: 100%;
    max-height: 100vh;
    overflow-y: auto;
}

.header {
    width: 100%;
    border-bottom: 1px solid var(--vscode-disabledForeground);
    border-top: 1px solid var(--vscode-disabledForeground);
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.header .tab {
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    border-right: 1px solid var(--vscode-disabledForeground);
    text-transform: uppercase;
    user-select: none;
}

.header .tab:not(.active):hover {
    border-bottom: 3px solid var(--vscode-panelTitle-activeBorder);
}

.header .tab.active {
    border-top: 1px solid var(--vscode-disabledForeground);
    background-color: var(--vscode-editor-background);
}

.section {
    width: 100%;
    background-color: var(--vscode-editor-background);
}
`;