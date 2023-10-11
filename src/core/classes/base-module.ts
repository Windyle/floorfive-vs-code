/**
 * Base class for modules.
 */
export class BaseModule {
    /**
     * The unique identifier of the module.
     * @type {string}
     * @private
     */
    private _id: string;

    /**
     * The label or name of the module.
     * @type {string}
     * @private
     */
    private _label: string;

    /**
     * The icon representing the module.
     * @type {string}
     * @private
     */
    private _icon: string;

    /**
     * A collection of commands associated with the module.
     * @type {Object.<string, any>}
     */
    public commands: { [id: string]: any } = {};

    /**
     * Creates an instance of BaseModule.
     * @param {string} id - The unique identifier of the module.
     * @param {string} label - The label or name of the module.
     * @param {string} icon - The icon representing the module.
     */
    constructor(id: string, label: string, icon: string) {
        this._id = id;
        this._label = label;
        this._icon = icon;
    }

    // Public methods

    /**
     * Executes a command associated with the module.
     * @param {string} commandId - The unique identifier of the command to execute.
     */
    public commandHandler = (commandId: string): void => {
        const command = this.commands[commandId];
        if (command) {
            command.execute();
        }
    };

    /**
     * Retrieves an array of commands associated with the module.
     * @returns {any[]} An array of commands.
     */
    public getCommandsArray(): any[] {
        return Object.keys(this.commands).map((id: string) => this.commands[id]);
    }

    // Getters

    /**
     * Gets the unique identifier of the module.
     * @returns {string} The module's identifier.
     */
    public getId = (): string => {
        return this._id;
    };

    /**
     * Gets the label or name of the module.
     * @returns {string} The module's label.
     */
    public getLabel = (): string => {
        return this._label;
    };

    /**
     * Generates HTML for displaying module actions.
     * @returns {string} HTML representation of module actions.
     */
    public getActionsHtml(): string {
        if (Object.keys(this.commands).length === 0 || Object.keys(this.commands).every((id: string) => !this.commands[id].show())) {
            return "";
        }

        // This code creates the HTML for the collapsible toolbar.
        // It loops through the commands and creates a button for each command that has been added to the toolbar.
        // The command's icon, label, and ID are used to create the button's HTML.
        // If the command's 'show' function returns false, the button is not added to the toolbar.

        return `
<div class="collapsible">
    <icon name="${ this._icon }"></icon>
    <h1>${ this.getLabel() }</h1>
    <div class="chevron-arrow"></div>
</div>
<div class="btns-container" id="${ this.getId() }-btns-container">
    ${ Object.keys(this.commands).map((id: string) => {
            const command = this.commands[id];
            if (command.show()) {
                return `<button class="command-button icon-button" id="${ this.getId() }-${ command.getId() }" loader="${ command.getWithLoader() }"><icon name="${ command.getIcon() }"></icon> <label>${ command.getLabel() }</label></button>`;
            }
        }).join("\n")
            }
</div>
        `;
    }
}
