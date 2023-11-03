/**
 * Utilities Service - contains utility functions for the most various purposes.
 */
export class Utilities {
  /**
   * Convert a string from snake case to camel case.
   * @param str - The string to convert.
   * @param useSpaces - Whether to use spaces instead of just removing the dashes.
   * @returns The converted string.
   */
  public static snakeToCamel(str: string, useSpaces: boolean = false): string {
    if (!useSpaces) {
      return str.replace(/([-][a-z])/gi, $1 => {
        return $1.toUpperCase().replace("-", "");
      });
    } else {
      return str.replace(/([-][a-z])/gi, $1 => {
        return ` ${$1.toUpperCase().replace("-", " ")}`;
      });
    }
  }

  /**
   * Convert a string from camel case to snake case.
   * @param str - The string to convert.
   * @returns The converted string.
   */
  public static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  /**
   * Convert a string from camel case to a sentence with spaces.
   * @param str - The string to convert.
   * @param capitalize - Whether to capitalize the first letter of the sentence.
   * @returns The converted string.
   */
  public static camelToSentence(str: string, capitalize: boolean = false): string {
    let res = str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);

    return capitalize ? Utilities.capitalize(res) : res;
  }

  /**
   * Capitalize a string (first letter).
   * @param str - The string to convert.
   * @returns The converted string.
   */
  public static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
