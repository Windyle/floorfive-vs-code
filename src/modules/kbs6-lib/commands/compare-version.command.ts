import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { PackageJson } from "../../../services/package-json.service";
import { Store } from "../../../store";
import { Kbs6LibModule } from "../kbs6-lib.module";

/**
 * A command for comparing the version of the @kbs6/kbs-lib package.
 */
export class CompareVersionCommand extends BaseCommand implements Command {

    // Indicates whether to show this command in the command palette.
    public showOnCommandPalette: boolean = false;

    // The child process for executing the npm command.
    private process: ChildProcessWithoutNullStreams | undefined;

    // Indicates whether the package is outdated.
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

    /**
     * Determines whether to show this command based on the current workspace.
     * @returns True if the command should be shown, otherwise false.
     */
    show(): boolean {
        return !Kbs6LibModule.isKbs6LibWorkspace();
    }

    /**
     * Determines whether to show this command in the command palette.
     * @returns True if the command should be shown in the palette, otherwise false.
     */
    showInPanel(): boolean {
        return this.show();
    }

    // Execute region

    /**
     * Executes the command to compare the package version.
     */
    execute(): void {
        this.openLogPanel();

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
                if (!this.process?.killed) {
                    this.isOutdated = data.toString().includes(`@kbs6/kbs-lib`);
                    this.console.log(data.toString(), `npm-outdated`);
                }
            });

            this.process.stderr.on(`data`, (data) => {
                if (!this.process?.killed) {
                    this.console.log(data.toString(), `error`);
                }
            });

            this.process.on(`close`, (code) => {
                if (!this.process?.killed) {
                    if (!this.isOutdated) {
                        this.console.log(`KBS6 Lib is up to date.`, `success`);
                    }

                    this.stopExecuting();
                }
            });
        }
        else {

            if (this.process) {
                this.process.kill();

                this.console.log(`Process killed.`);

                this.stopExecuting();
            }
        }
    }

    /**
     * Stops the execution of the command and resets state.
     */
    private stopExecuting() {
        this.isOutdated = false;
        this.executing = false;

        Store.mainViewWebview!.postMessage({
            command: `${this.getModule()}:${this.getId()}:listener`
        });
    }
}
