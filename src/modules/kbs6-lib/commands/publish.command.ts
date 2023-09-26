import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as fs from 'node:fs';
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { Store } from "../../../store";
import { Kbs6LibModule } from "../kbs6-lib.module";
import { WithModal } from "../../../core/types/with-modal";

export class PublishCommand extends BaseCommand implements Command, WithModal {

    public showOnCommandPalette: boolean = false;

    private process: ChildProcessWithoutNullStreams | undefined;

    constructor() {
        super(
            `kbs6-lib`,
            `publish`,
            `upload-cloud`,
            `Publish`,
            true
        );
    }

    executeModalAction(actionId: string): void {

        Store.mainViewWebview?.postMessage({
            command: `dismiss-modal`
        });

        switch (actionId) {
            case `confirm`:
                this.executeProcess();
                break;
            case `cancel`:
                this.stopExecuting();
                break;
        }
    };

    show(): boolean {
        return Kbs6LibModule.isKbs6LibWorkspace();
    }

    showInPanel(): boolean {
        return this.show();
    }

    // Execute region

    execute(): void {
        if (!this.executing) {
            Store.mainViewWebview?.postMessage({
                command: `show-modal`,
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
        }
        else {
            this.executeProcess();
        }
    }

    private executeProcess(): void {
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

    private stopExecuting() {
        this.executing = false;

        Store.mainViewWebview!.postMessage({
            command: `${this.getModule()}:${this.getId()}:listener`
        });
    }
}