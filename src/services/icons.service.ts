import * as vscode from 'vscode';
import * as fs from 'fs';
import { UtilitiesService } from "./utilities.service";
import { Store } from '../store';

/**
 * Icons Service - manages the icons of the extension for the templates.
 */
export class IconsService {

    private static readonly iconsList: string[] = Store.icons;

    /**
     * Gets the icons script by generating the template variables from local icons.
     * @param {vscode.ExtensionContext} context - The extension context.
     * @returns {string} The icons script.
     */
    public static getIconsScript = (context: vscode.ExtensionContext): string => {

        // Get path to resource on disk
        const extensionUri = context.extensionUri;

        // Get icons paths
        const iconsPaths: { [key: string]: vscode.Uri } = {};
        for (const icon of this.iconsList) {
            iconsPaths[icon] = vscode.Uri.joinPath(extensionUri, `assets`, `icons`, `${icon}.svg`);
        }

        let iconsScript = `
// ==== ICONS ====

var icons = {
    ${IconsService.iconsList.map(icon => {
            return `"${icon}": \`{{${UtilitiesService.snakeToCamel(icon)}Icon}}\``;
        })
            }
};

// ==== ASSIGN ICONS ====

// Search icon tags by alt attribute
const iconTags = document.querySelectorAll('icon[name]');

// Assign icons
iconTags.forEach(function(iconTag) {
    iconTag.innerHTML = icons[iconTag.getAttribute('name')];
});`;

        // Replace template variables with icons actual svg tags, read from files
        for (const key of Object.keys(iconsPaths)) {
            const icon = fs.readFileSync(iconsPaths[key].fsPath, `utf8`);
            iconsScript = iconsScript.replace(`{{${UtilitiesService.snakeToCamel(key)}Icon}}`, icon);
        }

        return iconsScript;

    };
}