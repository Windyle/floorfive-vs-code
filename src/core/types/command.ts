export interface Command {
    showOnCommandPalette: boolean;
    execute(): void;
    show(): boolean;
    showInPanel(): boolean;
}