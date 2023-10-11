import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";
import { WithModal } from "../../../core/types/with-modal";
import { Store } from "../../../store";

/**
 * Sample command with a confirmation modal before executing.
 */
export class WithConfirmCommand extends BaseCommand implements Command, WithModal {

    // Command Properties
    public showOnCommandPalette: boolean = false;

    // Custom properties
    private interval: NodeJS.Timeout | undefined;

    constructor() {
        super({
            module: "samples",
            id: "with-confirm",
            icon: "check-circle",
            label: "With Confirm",
            withLoader: true
        });

        // It is possible to add a custom log type to the console for a command by extending its console instance
        this.console.addLogType("customLog", (message: string): string => {
            return `<pre style="color: var(--vscode-terminal-ansiBrightBlue);">${ message }</pre>`;
        });
    }

    /**
     * Executes a modal action based on the provided action ID.
     * @param {string} actionId - The action ID to execute.
     */
    executeModalAction(actionId: string): void {
        Store.mainViewWebview?.postMessage({
            command: "@dismiss-modal"
        });

        switch (actionId) {
            case "confirm":
                this.executeProcess();
                break;
            case "cancel":
                this.stopExecuting();
                break;
        }
    }

    /**
     * Determines whether to show the command.
     * @returns {boolean} True if the command should be shown; otherwise, false.
     */
    show(): boolean {
        return true;
    }

    /**
     * Determines whether to show the command in a panel.
     * @returns {boolean} True if the command should be shown in a panel; otherwise, false.
     */
    showInPanel(): boolean {
        return true;
    }

    // Execute region

    /**
     * Executes the command.
     */
    execute(): void {
        if (!this.isExecuting()) {
            Store.mainViewWebview?.postMessage({
                command: "@show-modal",
                title: "Sample Confirm",
                content: `
                    Are you sure you want to run the command <b>With Confirm</b>?
                `,
                actions: [
                    {
                        module: this.getModule(),
                        command: this.getId(),
                        id: "cancel",
                        label: "Cancel",
                        class: "secondary"
                    },
                    {
                        module: this.getModule(),
                        command: this.getId(),
                        id: "confirm",
                        label: "Confirm",
                        class: "primary"
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

        this.toggleExecuting();
        if (this.isExecuting()) {
            this.console.clear();
            this.console.log(`Executing command: ${ this.getId() }`);

            let counter = 0;
            this.interval = setInterval(() => {
                // Log a message with a custom log type added to the console in the constructor
                this.console.log(`echo '${ counter }'`, "customLog");

                counter++;

                if (counter > 10) {
                    this.console.log("Done!", "success");
                    this.stopExecuting();
                }
            }, 1000);

        } else {
            this.console.log("Process killed.", "error");
            this.stopExecuting();
        }
    }

    private stopExecuting() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.setExecuting(false);

        Store.mainViewWebview!.postMessage({
            command: `${ this.getModule() }:${ this.getId() }:listener`
        });
    }

}
