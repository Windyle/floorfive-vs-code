import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";

export class CompareVersionCommand extends BaseCommand implements Command {

    constructor() {
        super(
            `kbs6-lib`,
            'compare-version',
            'arrows-right-left',
            'Compare Version',
            true
        );
    }

    show(): boolean {
        return true;
    }

    getScript(): string {
        return `
// => Compare Command

document.getElementById("${this.getModule()}-${this.getId()}").addEventListener("click", function() {

    setExecutingById(this, '${this.getIcon()}', '${this.getLabel()}');
    
    const message = {
        command: '${this.getModule()}:${this.getId()}:execute'
    };

    vscode.postMessage(message);
});

${this.executing ? `
        setExecutingById("${this.getModule()}-${this.getId()}", '${this.getIcon()}', '${this.getLabel()}');
    ` : ``
            }

// => End - Compare Command
        `;
    };

    getListenerScript(): string {
        return `
case '${this.getModule()}:${this.getId()}:listener':
    break;
        `;
    };

    // Execute region

    execute(): void {
        this.executing = !this.executing;
        if (this.executing) {
            console.log('compare version');
        }
        else {
            console.log('Stop compare version');
        }
    }
}