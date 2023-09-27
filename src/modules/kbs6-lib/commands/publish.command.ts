import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as fs from 'node:fs';
import * as vscode from "vscode";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { WithModal } from "../../../core/types/with-modal";
import { Store } from "../../../store";
import { Kbs6LibModule } from "../kbs6-lib.module";

/**
 * Represents the PublishCommand class responsible for publishing the KBS6 Lib.
 */
export class PublishCommand extends BaseCommand implements Command, WithModal {
    public showOnCommandPalette: boolean = false;

    private buildProcess: ChildProcessWithoutNullStreams | undefined;
    private publishProcess: ChildProcessWithoutNullStreams | undefined;

    private tarballDetailsPassed: boolean = false;

    constructor() {
        super(
            `kbs6-lib`,
            `publish`,
            `upload-cloud`,
            `Publish`,
            true
        );

        // Add log type for tarball details
        this.console.addLogType(`tarballDetails`, (message: string): string => {
            return `<pre style="color: var(--vscode-terminal-ansiBrightBlue);">${message}</pre>`;
        });
    }

    /**
     * Executes a modal action based on the provided action ID.
     * @param {string} actionId - The action ID to execute.
     */
    executeModalAction(actionId: string): void {
        Store.mainViewWebview?.postMessage({
            command: `@dismiss-modal`
        });

        switch (actionId) {
            case `confirm`:
                this.executeProcess();
                break;
            case `cancel`:
                this.stopExecuting();
                break;
        }
    }

    /**
     * Determines whether to show the command.
     * @returns {boolean} True if the command should be shown; otherwise, false.
     */
    show(): boolean {
        return Kbs6LibModule.isKbs6LibWorkspace();
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
        if (!this.executing) {
            Store.mainViewWebview?.postMessage({
                command: `@show-modal`,
                title: `Publish`,
                content: `
                    Are you sure you want to publish a new version of <b>@kbs6/kbs-lib</b>?
                `,
                actions: [
                    {
                        module: this.getModule(),
                        command: this.getId(),
                        id: `cancel`,
                        label: `Cancel`,
                        class: `secondary`
                    },
                    {
                        module: this.getModule(),
                        command: this.getId(),
                        id: `confirm`,
                        label: `Confirm`,
                        class: `primary`
                    }
                ],
                canDismiss: true
            });
        } else {
            this.executeProcess();
        }
    }

    private executeProcess(): void {
        this.openLogPanel();

        this.tarballDetailsPassed = false;

        this.executing = !this.executing;
        if (this.executing) {
            this.console.log(`This is a test log message.`);
            setInterval(() => {
                this.console.log(`This is a test log message.`);
            }, 5000);

            // this.console.clear();

            // // 1. Patch the version of @kbs6/kbs-lib
            // if (!this.patchLibVersion()) {
            //     this.stopExecuting();
            //     return;
            // }

            // // 2. Build the lib
            // this.buildProcess = this.buildLib();

            // this.buildProcess.on(`close`, async () => {
            //     if (!this.buildProcess?.killed) {

            //         // 3. Pre-publish actions
            //         if (!await this.prePublish()) {
            //             return;
            //         }

            //         // 4. Publish the lib
            //         this.publishProcess = this.publishLib();

            //         this.publishProcess.on(`close`, (code) => {
            //             if (!this.publishProcess?.killed) {

            //                 // 5. Post-publish actions
            //                 this.postPublish();

            //                 this.stopExecuting();
            //             }
            //         });
            //     }
            // });
        } else {
            if (this.buildProcess) {
                this.buildProcess.kill();
            }

            if (this.publishProcess) {
                this.publishProcess.kill();
            }

            this.deleteNotToPublishFolder();

            this.console.log(`Process killed.`);

            this.stopExecuting();
        }
    }

    private stopExecuting() {
        this.executing = false;
        this.tarballDetailsPassed = false;

        Store.mainViewWebview!.postMessage({
            command: `${this.getModule()}:${this.getId()}:listener`
        });
    }

    private patchLibVersion(): boolean {
        try {
            this.console.log(`1. Patching the version of @kbs6/kbs-lib...`, `step`);

            // Get the package.json file at projects/kbs/
            const packageJsonPath = `${Store.rootPath}/projects/kbs/package.json`;

            // Read the file
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, `utf8`));

            // Get the version
            const version = packageJson.version;
            const lastVersion = packageJson.lastVersion;

            // Increment its patch version if it's the same as the last version (to avoid incrementing the version when the lib is not published)
            let newVersion = version;
            if (parseInt(version.split(`.`)[2]) === parseInt(lastVersion.split(`.`)[2])) {
                const [major, minor, patch] = version.split(`.`);
                newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;
            }

            // Update the version in the file
            packageJson.version = newVersion;

            // Write the file
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, `\t`));

            this.console.log(`1.1. Update version and dependencies in globals.ts...`, `step`);

            // Get the globals.ts file at projects/kbs/src/globals.ts
            const globalsPath = `${Store.rootPath}/projects/kbs/src/globals.ts`;

            // Read the file
            const globalsFile = fs.readFileSync(globalsPath, `utf8`)
                .replace(`/* eslint-disable */\r\nexport const kbsGlobals = `, ``)
                .replace(/\t/g, ``)
                .replace(/\n/g, ``)
                .replace(/\r/g, ``)
                .replace(`};`, `}`);

            // Parse the json in the file
            const globals = JSON.parse(globalsFile);

            // Update the version in the file
            globals[`kbsLib`].version = newVersion;

            // Update the dependencies in the file
            globals[`kbsLib`].dependencies = {};
            Object.keys(packageJson.peerDependencies).forEach((dependency) => {
                globals[`kbsLib`].dependencies[dependency] = packageJson.peerDependencies[dependency];
            });

            // Write the file
            fs.writeFileSync(globalsPath, `/* eslint-disable */\r\nexport const kbsGlobals = ${JSON.stringify(globals, null, `\t`)};`);

            return true;
        }
        catch (err) {
            const error = err as Error;
            this.console.log(error.message, `error`);

            return false;
        }
    };

    private buildLib(): ChildProcessWithoutNullStreams {
        this.console.log(`2. Building the lib...`, `step`);

        const command = `npm run build-lib`;

        this.console.log(command, `consoleCommand`);

        const process = spawn(command.split(` `)[0], command.split(` `).slice(1), {
            cwd: `${Store.rootPath}`,
            shell: true
        });

        process.stdout.on(`data`, (data) => {
            this.console.log(data.toString());
        });

        process.stderr.on(`data`, (data) => {
            this.console.log(data.toString(), `error`);
        });

        return process;
    };

    private async prePublish(): Promise<boolean> {
        try {
            this.console.log(`3. Pre-publish actions...`, `step`);

            this.console.log(`3.1. Move assets not to be published to a temporary folder...`, `step`);

            // If the folder exists, delete it
            const tempFolder = `${Store.rootPath}/not-to-publish`;

            if (fs.existsSync(tempFolder)) {
                fs.rmSync(tempFolder, { recursive: true });
            }

            // Rename dist/kbs/assets/ folder into not-to-publish/
            await fs.promises.rename(`${Store.rootPath}/dist/kbs/assets`, tempFolder);

            // Add permissions to the folder (otherwise it can't be copied)
            await fs.promises.chmod(tempFolder, 0o777);

            // Move the not-to-publish/images/ged-fileicon/ folder to dist/kbs/assets/images/ged-fileicon/
            await fs.promises.cp(`${tempFolder}/images/ged-fileicon/`, `${Store.rootPath}/dist/kbs/assets/images/ged-fileicon/`, { recursive: true });

            return true;
        }
        catch (err) {
            const error = err as Error;

            this.console.log(error.message, `error`);

            return false;
        }
    };

    private publishLib(): ChildProcessWithoutNullStreams {
        this.console.log(`4. Publishing the lib...`, `step`);

        const command = `npm publish`;

        this.console.log(command, `consoleCommand`);

        const process = spawn(command.split(` `)[0], command.split(` `).slice(1), {
            cwd: `${Store.rootPath}/dist/kbs`,
            shell: true
        });

        process.stdout.on(`data`, (data) => {
            if (data.toString().includes(`+ @kbs6/kbs-lib@`)) {
                this.console.log(data.toString(), `success`);
            }
            else {
                this.console.log(data.toString());
            }
        });

        process.stderr.on(`data`, (data) => {
            if (data.toString().includes(`=== Tarball Details ===`) || this.tarballDetailsPassed) {
                this.console.log(data.toString(), `tarballDetails`);
                this.tarballDetailsPassed = true;
            }
            else if ((data.toString().toLowerCase().includes(`error`) || data.toString().toLowerCase().includes(`err`))
                && !data.toString().includes(`npm notice`)) {
                this.console.log(data.toString(), `error`);
            }
        });

        return process;
    };

    private async postPublish(): Promise<void> {
        try {
            this.console.log(`5. Post-publish actions...`, `step`);

            this.console.log(`5.1. Move assets not to be published back to dist/kbs/assets/...`, `step`);

            // Copy the contents of not-to-publish/ to dist/kbs/assets/
            await fs.promises.cp(`${Store.rootPath}/not-to-publish/`, `${Store.rootPath}/dist/kbs/assets/`, { recursive: true });

            // Delete the not-to-publish/ folder
            this.deleteNotToPublishFolder();

            this.console.log(`5.2. Update lastVersion property in package.json...`, `step`);

            // Get the package.json file at projects/kbs/
            const packageJsonPath = `${Store.rootPath}/projects/kbs/package.json`;

            // Read the file
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, `utf8`));

            // Get the version
            const version = packageJson.version;

            // Update the lastVersion property in the file
            packageJson.lastVersion = version;

            // Write the file
            await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, `\t`));

            this.console.log(`REMEMBER TO COMMIT AND PUSH THE PACKAGE.JSON FILE!!!`, `alert`);
        }
        catch (err) {
            const error = err as Error;

            this.console.log(error.message, `error`);
        }
    };

    private deleteNotToPublishFolder(): void {
        const tempFolder = `${Store.rootPath}/not-to-publish`;

        if (fs.existsSync(tempFolder)) {
            fs.rmSync(tempFolder, { recursive: true });
        }
    };
}
