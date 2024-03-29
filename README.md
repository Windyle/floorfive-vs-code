# FloorFive - VS Code Extension Boilerplate

<div style="display: flex; gap: 10px; margin-bottom: 20px;">
<img src="https://img.shields.io/badge/vscode-1.81.0-blue" />
<img src="https://img.shields.io/badge/node-18.18.0-green" />
<img src="https://img.shields.io/badge/npm-9.8.1-red" />
</div>

This boilerplate was created with the aim of providing a simple foundation for a fully customizable extension, allowing for the quick setup and functionality of a tool to launch commands and automate the lengthy and/or repetitive parts of development that can be scripted in some way.

With the FloorFive - VS Code base, it's possible to set up a new command in just a few minutes, with easy definition of both functional and aesthetic attributes such as icon, provision for a loader in case of long-running commands, label, pre-execution confirmation prompt, and the execution itself.

## Usage

For usage instructions, check the [USAGE.md](USAGE.md) file.

## Features

### Commands

The main feature of this boilerplate is the ability to create commands that can be easily executed with a single click, without having to remember the command itself or its parameters. The commands can be grouped into categories, which are displayed in the extension's sidebar, and can be executed from there or from the command palette if configured to do so.

<div style="text-align: center">
<img src="https://i.ibb.co/vqppXKR/commands-example-screen.png"/>
</div>

It is also possible to instantiate commands dynamically if you need to create a single command class that needs to be executed with different parameters.

<div style="text-align: center">
<img src="https://i.ibb.co/M9MBHqD/dynamic-commands-example-screen.png" />
</div>

### Output panel

The extension also provides a custom output panel that can be used to display information to the user, such as the progress of a command or the result of its execution.

The panel is fully customizable.

<div style="text-align: center">
<img src="https://i.ibb.co/NxZ9FrF/output-panel-example-screen.png" />
</div>

### Icons

The extension implements an icons injection system that allows you to easily add icons to it.
It is only necessary to add the `svg` icon to the `assets/icons` folder and add the icon name to the `icons.ts` file, and the icon will be available for use in the extension.

### Themes

The extension is fully built on top of the VS Code theme system, so it automatically adapts to the theme in use.

## Known Issues

There are no known issues at this time.

## Release Notes

Check the [CHANGELOG.md](CHANGELOG.md) file for more information.

### 1.0.0 - Coming soon

Initial release of **FloorFive - VS Code Extension Boilerplate**.
Contains the basic structure for creating commands and the output panel.
