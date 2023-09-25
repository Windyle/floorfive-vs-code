export class BaseModule {

    private id: string;
    private label: string;

    public commands: { [id: string]: any } = {};


    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    // Public methods

    public commandHandler = (commandId: string): void => {
        const command = this.commands[commandId];
        if (command) {
            command.execute();
        }
    };

    // Getters

    public getCommandsArray(): any[] {
        return Object.keys(this.commands).map((id: string) => this.commands[id]);
    }

    public getId = (): string => {
        return this.id;
    };

    public getLabel = (): string => {
        return this.label;
    };

    public getActionsHtml(): string {

        if (Object.keys(this.commands).length === 0
            || Object.keys(this.commands).every((id: string) => !this.commands[id].show())) {
            return ``;
        }

        return `
        <div class="collapsible">
            <h1>${this.getLabel()}</h1>
            <div class="chevron-arrow"></div>
        </div>
        <div class="btns-container" id="${this.getId()}-btns-container">
              ${Object.keys(this.commands).map((id: string) => {
            const command = this.commands[id];
            if (command.show()) {
                if (command.getWithLoader()) {
                    return `<button class="command-button icon-button" id="${this.getId()}-${command.getId()}"><icon name="${command.getIcon()}"></icon> <label>${command.getLabel()}</label></button>`;
                }
                else {
                    return `<button class="command-button" id="${this.getId()}-${command.getId()}">${command.getLabel()}</button>`;
                }
            }
        }).join(`\n`)
            }
        </div>
        `;
    }
}