import * as vscode from 'vscode';

import { Kbs6DevView } from './kbs6-dev/kbs6-dev.view';

export class Views {

    public static activateAll = (context: vscode.ExtensionContext) => {
        // Register the views
        Kbs6DevView.activate(context);
    };

}