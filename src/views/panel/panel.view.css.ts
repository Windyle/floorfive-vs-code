export const CSS: string = `
/* Reset default margin and padding */
html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
}

/* Layout container */
.container {
    display: grid;
    grid-template-columns: 250px 1fr;
    width: 100vw;
    height: 100vh; /* Set height to 100vh */
    overflow: hidden;
}

/* Collapsed container */
.container.collapsed {
    grid-template-columns: 60px 1fr;
}

/* Sidebar */
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: calc(100vh - 30px);
    overflow-y: auto;
    border-right: 1px solid var(--vscode-disabledForeground);
    padding: 15px;
}

/* Sidebar buttons */
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
    text-transform: uppercase;
}

/* Hide buttons when collapsed */
.container.collapsed .sidebar button {
    display: none;
}

/* Sidebar button hover effect */
.sidebar button:hover {
    opacity: 0.8;
}

/* Active sidebar button */
.sidebar button.active {
    background-color: var(--vscode-inputValidation-warningBorder);
}

/* Sidebar collapse button */
.sidebar #sidebar-collapse {
    margin-top: auto;
    margin-bottom: 0;
    background-color: transparent;
    border: 1px solid var(--vscode-disabledForeground);
    color: var(--vscode-disabledForeground);
}

/* Styling for collapsed sidebar */
.container.collapsed #sidebar-collapse {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

/* Sidebar collapse icon */
.sidebar #sidebar-collapse icon svg {
    transition: transform 0.2s ease-in-out;
}

/* Rotate icon when collapsed */
.sidebar #sidebar-collapse.collapsed icon svg {
    transform: rotate(180deg);
}

/* Main content area */
.main {
    display: grid;
    grid-template-rows: 30px 1fr;
    height: 100%;
    overflow-y: auto;
}

/* Header */
.header {
    width: 100%;
    border-bottom: 1px solid var(--vscode-disabledForeground);
    border-top: 1px solid var(--vscode-disabledForeground);
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

/* Header tabs */
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

/* Header tab hover effect */
.header .tab:not(.active):hover {
    border-bottom: 3px solid var(--vscode-panelTitle-activeBorder);
}

/* Active header tab */
.header .tab.active {
    border-bottom: 3px solid var(--vscode-panelTitle-activeBorder);
}

/* Panel buttons */
.panel-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 25px;
    gap: 10px;
    position: absolute;
    right: 0;
    top: 30px;
    z-index: 2;
}

/* Styling for panel buttons */
.panel-buttons button {
    background-color: transparent;
    border: none;
    color: var(--vscode-disabledForeground);
    width: 20px;
    height: 20px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
    opacity: 0.5;
}

/* Panel button icon size */
.panel-buttons button svg {
    width: 20px;
    height: 20px;
}

/* Panel button hover effect */
.panel-buttons button:hover {
    opacity: 0.3;
}

/* Console panel */
#console-panel {
    max-width: calc(100vw - 250px);
    overflow: auto;
    margin: 0;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
}

/* Styling for console panel pre tags */
#console-panel pre {
    margin: 5px 0px;
}

/* Styling for collapsed console panel */
.container.collapsed #console-panel {
    max-width: calc(100vw - 60px);
}

/* Code within the console panel */
#console-panel code {
    padding: 5px 20px;
    box-sizing: border-box;
    overflow-x: visible;
}

`;