import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as fs from 'node:fs';
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { Store } from "../../../store";
import { Kbs6LibModule } from "../kbs6-lib.module";
import { WithModal } from "../../../core/types/with-modal";

/**
 * Represents the PublishCommand class responsible for publishing the KBS6 Lib.
 */
export class PublishCommand extends BaseCommand implements Command, WithModal {
    public showOnCommandPalette: boolean = false;

    private buildProcess: ChildProcessWithoutNullStreams | undefined;
    private publishProcess: ChildProcessWithoutNullStreams | undefined;

    constructor() {
        super(
            `kbs6-lib`,
            `publish`,
            `upload-cloud`,
            `Publish`,
            true
        );
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

        this.executing = !this.executing;
        if (this.executing) {
            this.console.clear();

            // 1. Patch the version of @kbs6/kbs-lib
            this.patchLibVersion();

            // 2. Build the lib
            this.buildProcess = this.buildLib();

            this.buildProcess.on(`close`, (code) => {
                if (!this.buildProcess?.killed) {

                    // 3. Pre-publish actions
                    this.prePublish();

                    // 4. Publish the lib
                    this.publishProcess = this.publishLib();

                    this.publishProcess.on(`close`, (code) => {
                        if (!this.publishProcess?.killed) {

                            // 5. Post-publish actions
                            this.postPublish();

                            this.stopExecuting();
                        }
                    });
                }
            });
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

        Store.mainViewWebview!.postMessage({
            command: `${this.getModule()}:${this.getId()}:listener`
        });
    }

    private patchLibVersion = (): void => {
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
    };

    private buildLib = (): ChildProcessWithoutNullStreams => {
        this.console.log(`2. Building the lib...`, `step`);

        const command = `npm run build-lib`;

        this.console.log(command, `command`);

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

    private prePublish = (): void => {
        this.console.log(`3. Pre-publish actions: Move assets not to be published to a temporary folder...`, `step`);

        // If the folder exists, delete it
        const tempFolder = `${Store.rootPath}/not-to-publish`;

        if (fs.existsSync(tempFolder)) {
            fs.rmSync(tempFolder, { recursive: true });
        }

        // Rename dist/kbs/assets/ folder into not-to-publish/
        fs.renameSync(`${Store.rootPath}/dist/kbs/assets`, tempFolder);

        // Move the not-to-publish/images/ged-fileicon/ folder to dist/kbs/assets/images/ged-fileicon/
        fs.renameSync(`${tempFolder}/images/ged-fileicon`, `${Store.rootPath}/dist/kbs/assets/images/ged-fileicon`);
    };

    private publishLib = (): ChildProcessWithoutNullStreams => {
        this.console.log(`4. Publishing the lib...`, `step`);

        const command = `npm publish`;

        this.console.log(command, `command`);

        const process = spawn(command.split(` `)[0], command.split(` `).slice(1), {
            cwd: `${Store.rootPath}/dist/kbs`,
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

    private postPublish = (): void => {
        this.console.log(`5. Post-publish actions...`, `step`);

        this.console.log(`5.1. Move assets not to be published back to dist/kbs/assets/...`, `step`);

        // Move the files from dist/kbs/assets/images/ged-fileicon/ to not-to-publish/images/ged-fileicon/
        fs.renameSync(`${Store.rootPath}/dist/kbs/assets/images/ged-fileicon`, `${Store.rootPath}/not-to-publish/images/ged-fileicon`);

        // Rename not-to-publish/ back to dist/kbs/assets/
        fs.renameSync(`${Store.rootPath}/not-to-publish`, `${Store.rootPath}/dist/kbs/assets`);

        // Delete the not-to-publish/ folder
        fs.rmdirSync(`${Store.rootPath}/not-to-publish`, { recursive: true });

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
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, `\t`));

        this.console.log(`REMEMBER TO COMMIT AND PUSH THE PACKAGE.JSON FILE!!!`, `alert`);
    };

    private deleteNotToPublishFolder = (): void => {
        const tempFolder = `${Store.rootPath}/not-to-publish`;

        if (fs.existsSync(tempFolder)) {
            fs.rmSync(tempFolder, { recursive: true });
        }
    };
}
