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
    height: 100vh;
    overflow: hidden;
}

.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    background-color: var(--vscode-editor-background);
    border-right: 1px solid var(--vscode-textBlockQuote-border);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
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
`;