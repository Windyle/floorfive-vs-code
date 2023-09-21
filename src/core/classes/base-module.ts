export class BaseModule {

    private id: string;
    private label: string;
    public commands: { [id: string]: any } = {};

    constructor(id: string, label: string) {
        this.id = id;
        this.label = label;
    }

    public getId = (): string => {
        return this.id;
    };

    public getLabel = (): string => {
        return this.label;
    };

    public getActionsHtml(): string {
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
        }).join('\n')
            }
        </div>
        `;
    }
}