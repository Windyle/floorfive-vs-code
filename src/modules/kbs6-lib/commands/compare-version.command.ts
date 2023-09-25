import { ChildProcess, ChildProcessWithoutNullStreams, spawn } from "child_process";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { HighlightLanguages } from "../../../core/enums/highlight-languages";
import { Store } from "../../../store";
import { PackageJson } from "../../../services/package-json.service";

export class CompareVersionCommand extends BaseCommand implements Command {

    private process: ChildProcessWithoutNullStreams | undefined;
    private isOutdated: boolean = false;

    constructor() {
        super(
            `kbs6-lib`,
            `compare-version`,
            `arrows-right-left`,
            `Compare Version`,
            true
        );

        // Custom Console Format Method

        this.console.addLogMethod(`npm-outdated`, (message: string, config?: {}): string => {

            const lines = message.split(`\n`);
            let output = `<pre>${lines[0]}`;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];

                // Color each column
                const columns = line.split(` `);
                for (let j = 0, color = 0; j < columns.length; j++, color++) {
                    const column = columns[j];

                    if (column === ``) {
                        color--;
                        continue;
                    }

                    if (color === Store.terminalColorsCssVars.length) {
                        color = 0;
                    }

                    columns[j] = `<span style="color: var(${Store.terminalColorsCssVars[color]});">${column}</span>`;
                }

                output += `\n${columns.join(` `)}`;
            }

            return `${output}</pre>`;
        });
    }

    show(): boolean {
        return true;
    }

    getScript(): string {
        return `
// => Compare Command

document.getElementById("${this.getModule()}-${this.getId()}").addEventListener("click", function() {

    setExecuting(this, '${this.getIcon()}', '${this.getLabel()}');
    
    const message = {
        command: '${this.getModule()}:${this.getId()}:execute'
    };

    vscode.postMessage(message);
});

// => End - Compare Command
        `;
    };

    getListenerScript(): string {
        return `
case '${this.getModule()}:${this.getId()}:listener':
        setExecutingById("${this.getModule()}-${this.getId()}", '${this.getIcon()}', '${this.getLabel()}');
    break;
        `;
    };

    // Execute region

    execute(): void {

        if (PackageJson.getDependencies() === undefined || !Object.keys(PackageJson.getDependencies()!).includes(`@kbs6/kbs-lib`)) {
            this.console.clear();
            this.console.log(`KBS6 Lib is not installed.`, `error`);

            Store.mainViewWebview!.postMessage({
                command: `${this.getModule()}:${this.getId()}:listener`
            });

            return;
        }

        this.executing = !this.executing;
        if (this.executing) {

            const command = `npm outdated @kbs6/kbs-lib`;

            this.console.clear();
            this.console.log(command, `consoleCommand`);

            this.process = spawn(command.split(` `)[0], command.split(` `).slice(1), {
                cwd: Store.rootPath,
                shell: true
            });

            this.process.stdout.on(`data`, (data) => {
                this.isOutdated = data.toString().includes(`@kbs6/kbs-lib`);
                this.console.log(data.toString(), `npm-outdated`);
            });

            this.process.stderr.on(`data`, (data) => {
                this.console.log(data.toString(), `error`);
            });

            this.process.on(`close`, (code) => {
                if (!this.isOutdated) {
                    this.console.log(`KBS6 Lib is up to date.`, `success`);
                }

                this.executing = false;
                this.process = undefined;

                Store.mainViewWebview!.postMessage({
                    command: `${this.getModule()}:${this.getId()}:listener`
                });
            });
        }
        else {

            if (this.process) {
                this.process.kill();
                this.process = undefined;
                this.isOutdated = false;

                this.console.log(`Process killed.`);
            }
        }
    }
}