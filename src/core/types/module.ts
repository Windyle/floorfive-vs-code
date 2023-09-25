export interface Module {
    commands: { [id: string]: any };
    show(): boolean;
}