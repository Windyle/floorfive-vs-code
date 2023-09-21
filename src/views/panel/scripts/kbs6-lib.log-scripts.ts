import { Modules } from "../../../core/enums/console-categories";
import { ConsoleTabs } from "../../../core/enums/console-tabs";

const categoryId = Modules.kbs6Lib;

export const KBS6_LIB_LOG_SCRIPTS = `
// ==> Compare
case 'log-${categoryId}:${ConsoleTabs[categoryId][`compareVersions`].id}':
    panels["${categoryId}"]["${ConsoleTabs[categoryId][`compareVersions`].id}"] += '<code class="language-' + message.language + '">' + message.content + '</code>';

    if (activePanel === '${categoryId}:${ConsoleTabs[categoryId][`compareVersions`].id}') {
        setActivePanelContent('${categoryId}', '${ConsoleTabs[categoryId][`compareVersions`].id}');
    }
break;

`;