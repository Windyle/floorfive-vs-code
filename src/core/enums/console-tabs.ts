import type { ConsoleTabs as ConsoleTabsType } from "../types/console-tab";
import { Modules } from "./console-categories";

/* eslint-disable @typescript-eslint/naming-convention */
export const ConsoleTabs: ConsoleTabsType = {
    [Modules.angularDeploy]: {
        deploy: {
            id: `deploy`,
            label: `Deploy`,
        },
    },
    [Modules.kbs6Lib]: {
        installLatest: {
            id: `install-latest`,
            label: `Install latest`,
        },
        compareVersions: {
            id: `compare-versions`,
            label: `Compare versions`,
        },
        publish: {
            id: `publish`,
            label: `Publish`,
        },
    },
    [Modules.lint]: {
        lint: {
            id: `lint`,
            label: `Lint`,
        },
    },
    [Modules.kbsMobile]: {
        setEnvironment: {
            id: `set-environment`,
            label: `Set environment`,
        },
        incrementVersion: {
            id: `increment-version`,
            label: `Increment version`,
        },
        configurationsRoutes: {
            id: `configurations-routes`,
            label: `Configurations routes`,
        },
        entitiesPropertiesList: {
            id: `entities-properties-list`,
            label: `Entities properties list`,
        },
        globalVariables: {
            id: `global-variables`,
            label: `Global variables`,
        },
    },
};