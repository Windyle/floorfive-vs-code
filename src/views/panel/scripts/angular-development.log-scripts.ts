import { ConsoleCategories } from "../../../core/enums/console-categories";
import { ConsoleTabs } from "../../../core/enums/console-tabs";

const categoryId = ConsoleCategories.angularDevelopment;

export const ANGULAR_DEVELOPMENT_LOG_SCRIPTS = `
// ==> Serve
case 'log-${categoryId}:${ConsoleTabs[categoryId][`serve`].id}':
    panels.${categoryId}.${ConsoleTabs[categoryId][`serve`].id} += message.content;

    if (activePanel === '${categoryId}:${ConsoleTabs[categoryId][`serve`].id}') {
        setActivePanelContent('${categoryId}', '${ConsoleTabs[categoryId][`serve`].id}');
    }
break;

`;