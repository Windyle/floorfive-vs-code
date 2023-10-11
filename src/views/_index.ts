import * as vscode from "vscode";

import { MainView } from "./main/main.view";
import { PanelView } from "./panel/panel.view";

export class Views {

    public static activateAll = (context: vscode.ExtensionContext) => {
        // Register the views
        MainView.activate(context);
        PanelView.activate(context);
    };

}