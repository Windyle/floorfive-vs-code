/**
 * Utilities Service - contains utility functions for the most various purposes.
 */
export class UtilitiesService {

    /**
     * Convert a string from snake case to camel case.
     * @param str - The string to convert.
     * @returns The converted string.
     */
    public static snakeToCamel = (str: string): string => {
        return str.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
                .replace(`-`, ``)
                .replace(`_`, ``);
        });
    };
}