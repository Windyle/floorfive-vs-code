import * as fs from "node:fs";
import * as vscode from "vscode";
import { BaseCommand } from "../../../core/classes/base-command";
import { Command } from "../../../core/types/command";

export class OpenNpmrcCommand extends BaseCommand implements Command {

    public showOnCommandPalette: boolean = false;

    constructor() {
        super(
            `settings`,
            `open-npmrc`,
            `edit`,
            `Open .npmrc`,
            false
        );

        // Custom Console Format Method
    }

    show(): boolean {
        return true;
    }

    showInPanel(): boolean {
        return false;
    }

    // Execute region

    execute(): void {
        // Open current user .npmrc file if exists (or create it)
        // Path is: C:\Users\{username}\.npmrc

        const npmrcPath = `${process.env.USERPROFILE}\\.npmrc`;

        // Check if file exists
        if (!fs.existsSync(npmrcPath)) {
            fs.writeFileSync(npmrcPath, ``);
        }

        // Open file
        this.openFile(npmrcPath);
    }

    private openFile(path: string): void {
        // Open file in editor
        vscode.workspace.openTextDocument(path).then((doc) => {
            vscode.window.showTextDocument(doc);
        });
    }
}