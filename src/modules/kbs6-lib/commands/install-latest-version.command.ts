import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { Store } from "../../../store";
import * as fs from 'node:fs';

export class InstallLatestVersionCommand extends BaseCommand implements Command {

    public showOnCommandPalette: boolean = false;

    private process: ChildProcessWithoutNullStreams | undefined;

    constructor() {
        super(
            `kbs6-lib`,
            `install-latest-version`,
            `download-cloud`,
            `Install Latest Version`,
            true
        );

    }

    show(): boolean {
        return true;
    }

    showInPanel(): boolean {
        return true;
    }

    // Execute region

    execute(): void {
        this.openLogPanel();

        this.executing = !this.executing;
        if (this.executing) {

            const command = `npm install @kbs6/kbs-lib@latest`;

            this.console.clear();
            this.console.log(command, `consoleCommand`);

            this.process = spawn(command.split(` `)[0], command.split(` `).slice(1), {
                cwd: Store.rootPath,
                shell: true
            });

            this.process.stdout.on(`data`, (data) => {
                if (!this.process?.killed) {
                    this.console.log(data.toString());
                }
            });

            this.process.stderr.on(`data`, (data) => {
                if (!this.process?.killed) {
                    this.console.log(data.toString(), `error`);
                }
            });

            this.process.on(`close`, (code) => {
                if (!this.process?.killed) {
                    this.postInstall();
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

    private postInstall() {

        try {
            // Move everything from the @kbs6/kbs-lib/assets/images/ged-fileicon folder to the project assets/images/ged-fileicon folder
            const source = `${Store.rootPath}/node_modules/@kbs6/kbs-lib/assets/images/ged-fileicon`;
            const destination = `${Store.rootPath}/src/assets/images/ged-fileicon`;

            // Check if the source folder exists
            if (!fs.existsSync(source)) {
                throw new Error(`Source folder doesn't exist.`);
            }

            // Check if the destination folder exists
            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true });
            }

            this.console.log(`Copying files from ${source} to ${destination} ...`);

            // Copy all files from the source folder to the destination folder
            fs.readdirSync(source).forEach(file => {
                fs.copyFileSync(`${source}/${file}`, `${destination}/${file}`);
            });

            this.console.log(`Files copied successfully.`, `success`);
            this.console.log(`Installation completed successfully.`, `success`);
        }
        catch (error) {
            this.console.log((error as Error).message, `error`);
        }

        this.stopExecuting();
    };

    private stopExecuting() {
        this.executing = false;

        Store.mainViewWebview!.postMessage({
            command: `${this.getModule()}:${this.getId()}:listener`
        });
    }
}