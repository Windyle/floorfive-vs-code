import * as vscode from "vscode";

/**
 * Settings Service - contains functions to handle vscode settings.
 */
export class Settings {
  /**
   * Get a setting value under the extension's namespace.
   * @param key - The key of the setting to get.
   * @returns The value of the setting.
   */
  public static get(key: string): any {
    return vscode.workspace.getConfiguration("floorfive-vs-code").get(key);
  }

  /**
   * Set a setting value under the extension's namespace.
   * @param key - The key of the setting to set.
   * @param value - The value to set.
   */
  public static set(key: string, value: any): void {
    vscode.workspace.getConfiguration("floorfive-vs-code").update(key, value, vscode.ConfigurationTarget.Global);
  }

  /**
   * Append a value to an array setting under the extension's namespace.
   * @param key - The key of the setting to append to.
   * @param value - The value to append.
   */
  public static append(key: string, value: any): void {
    const currentValue = this.get(key);

    if (Array.isArray(currentValue)) {
      currentValue.push(value);

      this.set(key, currentValue);
    }
  }
}
