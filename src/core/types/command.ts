export interface Command {
    execute(): void;
    show(): boolean;
    getScript(): string;
    getListenerScript(): string;
}