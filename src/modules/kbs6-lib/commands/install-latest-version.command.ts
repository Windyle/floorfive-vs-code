import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as fs from 'node:fs';
import * as path from 'node:path';
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { Store } from "../../../store";
import { Kbs6LibModule } from "../kbs6-lib.module";

/**
 * Represents the InstallLatestVersionCommand class responsible for installing the latest version of the KBS6 Lib.
 */
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

    /**
     * Determines whether to show the command.
     * @returns {boolean} True if the command should be shown; otherwise, false.
     */
    show(): boolean {
        return !Kbs6LibModule.isKbs6LibWorkspace();
    }

    /**
     * Determines whether to show the command in a panel.
     * @returns {boolean} True if the command should be shown in a panel; otherwise, false.
     */
    showInPanel(): boolean {
        return this.show();
    }

    // Execute region

    /**
     * Executes the command.
     */
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
        } else {
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
            const source = path.join(Store.rootPath, `node_modules`, `@kbs6`, `kbs-lib`, `assets`, `images`, `ged-fileicon`);
            const destination = path.join(Store.rootPath, `src`, `assets`, `images`, `ged-fileicon`);

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
                fs.copyFileSync(path.join(source, file), path.join(destination, file));
            });

            this.console.log(`Files copied successfully.`, `success`);
            this.console.log(`Installation completed successfully.`, `success`);
        } catch (error) {
            this.console.log((error as Error).message, `error`);
        }

        this.stopExecuting();
    }

    private stopExecuting() {
        this.executing = false;

        Store.mainViewWebview!.postMessage({
            command: `${this.getModule()}:${this.getId()}:listener`
        });
    }
}
