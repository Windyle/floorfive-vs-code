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

    execute(): void {
        console.log('Compare Version Command');
    }

    getScript(): string {
        return `
// => Compare Command

document.getElementById("${this.getModule()}-${this.getId()}").addEventListener("click", function() {

    const iconTag = this.querySelector('icon');
    const iconName = iconTag.getAttribute('name');

    if(iconName === 'arrows-right-left') {
        iconTag.setAttribute('name', 'square');
        iconTag.innerHTML = icons['square'];
        iconTag.querySelector('svg').classList.add('flip');
        this.querySelector('label').innerHTML = 'Stop ${this.getLabel()}';
    }
    else {
        iconTag.setAttribute('name', 'arrows-right-left');
        iconTag.innerHTML = icons['arrows-right-left'];
        iconTag.querySelector('svg').classList.remove('flip');
        this.querySelector('label').innerHTML = '${this.getLabel()}';

        this.classList.add('disabled');
        setTimeout(() => {
            this.classList.remove('disabled');
        }, 1500);
    }
    
    const message = {
        command: '${this.getModule()}-${this.getId()}:execute'
    };

    vscode.postMessage(message);
});

// => End - Compare Command
        `;
    };

    getListenerScript(): string {
        return `
case '${this.getModule()}-${this.getId()}:listener':
    break;
        `;
    };
}