export interface CommandConfig {
    module: string;
    id: string;
    icon: string;
    label: string;
    withLoader?: boolean;
    loaderLabel?: string;
    subCommand?: boolean;
    unstoppable?: boolean;
    customize?: {
        light?: CommandButtonCustomizations; 
        dark?: CommandButtonCustomizations;
    }
}

export interface CommandButtonCustomizations {
    textColor?: string;
    backgroundColor?: string;
    borderColor?: string;
}