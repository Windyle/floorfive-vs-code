export interface Command {
    execute(): void;
    show(): boolean;
    showInPanel(): boolean;
}