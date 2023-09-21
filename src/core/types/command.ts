import { FFConsole } from "../../services/console.service";

export interface Command {
    execute(): void;
    show(): boolean;
}