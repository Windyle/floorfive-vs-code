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

.container.collapsed {
    grid-template-columns: 60px 1fr;
}

.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: calc(100vh - 30px);
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
    user-select: none;
}

.container.collapsed .sidebar button {
    display: none;
}

.sidebar button:hover {
    opacity: 0.8;
}

.sidebar button.active {
    border-right: 6px solid var(--vscode-panelTitle-activeBorder);
}

.sidebar #sidebar-collapse {
    margin-top: auto;
    margin-bottom: 0;
    background-color: transparent;
    border: 1px solid var(--vscode-disabledForeground);
    color: var(--vscode-disabledForeground);
}

.container.collapsed #sidebar-collapse {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.sidebar #sidebar-collapse icon svg {
    transition: transform 0.2s ease-in-out;
}

.sidebar #sidebar-collapse.collapsed icon svg {
    transform: rotate(180deg);
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
    border-bottom: 3px solid var(--vscode-panelTitle-activeBorder);
}

#console-panel {
    max-width: calc(100vw - 250px);
    overflow: auto;
    margin: 0;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
}

.container.collapsed #console-panel {
    max-width: calc(100vw - 60px);
}

#console-panel code {
    padding: 5px 20px;
    box-sizing: border-box;
    overflow-x: visible;
}

`;