export interface CommandConfig {
    module: string;
    id: string;
    icon: string;
    label: string;
    withLoader?: boolean;
    loaderLabel?: string;
    subCommand?: boolean;
}