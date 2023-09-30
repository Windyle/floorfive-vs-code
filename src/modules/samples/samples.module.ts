import { BaseModule } from '../../core/classes/base-module';
import { Module } from '../../core/types/module';
import { SimpleCommandCommand } from './commands/simple-command.command';
import { WithConfirmCommand } from './commands/with-confirm.command';
import { WithLoaderCommand } from './commands/with-loader.command';

/**
 * A sample module to use as a template for new modules.
 */
export class SamplesModule extends BaseModule implements Module {

    constructor() {
        super(`samples`, `Samples`, `book`);

        const simpleCommandCommand = new SimpleCommandCommand();
        const withLoaderCommand = new WithLoaderCommand();
        const withConfirmCommand = new WithConfirmCommand();

        // Add command instances to the commands object
        this.commands[simpleCommandCommand.getId()] = simpleCommandCommand;
        this.commands[withLoaderCommand.getId()] = withLoaderCommand;
        this.commands[withConfirmCommand.getId()] = withConfirmCommand;
    }

    /**
     * Determines whether to show the module.
     * @returns {boolean} True if any command in the module should be shown; otherwise, false.
     */
    public show(): boolean {
        // If every command in the module is hiddendon't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].show())) {
            return false;
        }

        return true;
    }

    /**
     * Determines whether to show the module in a panel.
     * @returns {boolean} True if any command in the module should be shown in a panel; otherwise, false.
     */
    public showInPanel(): boolean {
        // If every command in the module is hidden in the panel, don't show the view
        if (Object.keys(this.commands).every((id: string) => !this.commands[id].showInPanel())) {
            return false;
        }

        return true;
    }
}
