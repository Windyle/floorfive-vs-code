import { BaseCommand } from "../../../core/classes/base-command";
import { Modules } from "../../../core/enums/console-categories";
import { ConsoleTabs } from "../../../core/enums/console-tabs";
import { Command } from "../../../core/types/command";
import { ConsoleInstantiator, FFConsole } from "../../../services/console.service";

export class CompareVersionCommand extends BaseCommand implements Command {

    constructor() {
        super(
            Modules.kbs6Lib,
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
}