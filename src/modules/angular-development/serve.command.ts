import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Store } from '../../store';
import { SpawnCommand } from '../../core/types/spawn-command';
import { PackageJson } from '../../services/package-json.service';
import { HighlightLanguages } from '../../core/enums/highlight-languages';
import { ConsoleInstantiator, FFConsole } from '../../services/console.service';
import { ConsoleCategories } from '../../core/enums/console-categories';
import { ConsoleTabs } from '../../core/enums/console-tabs';

export class ServeCommand {

    private static status: boolean = false;
    private static process: ChildProcessWithoutNullStreams | undefined;
    private static port: number = 4200;
    private static console: FFConsole;

    constructor() {
        ServeCommand.console = ConsoleInstantiator.instantiate(
            ConsoleCategories.angularDevelopment,
            ConsoleTabs[ConsoleCategories.angularDevelopment][`serve`].id,
            HighlightLanguages.plaintext
        );
    }

    public execute = () => {

        ServeCommand.status = !ServeCommand.status;

        if (ServeCommand.status) {

            // Run the process
            this.runProcess();

        } else {

            // Kill the process
            if (ServeCommand.process) {
                this.resetProcess(true);
            }

        }
    };

    private runProcess = () => {

        // Get the command
        const command = this.getCommand();

        ServeCommand.console.clear();
        ServeCommand.console.log(command.command + ` ` + command.args.join(` `), HighlightLanguages.css);

        // Run the process
        ServeCommand.process = spawn(command.command, command.args, {
            shell: true,
            cwd: Store.rootPath
        });

        // Listen for data
        ServeCommand.process.stdout.on('data', (data: any) => {
            ServeCommand.console.log(data.toString());

            if (data.toString().includes(`Port ${ServeCommand.port} is already in use`)) {
                this.findPIDAndKill();
            }
        });

        // Listen for errors
        ServeCommand.process.stderr.on('data', (data: any) => {
            ServeCommand.console.log(data.toString());
        });

        // Listen for close
        ServeCommand.process.on('close', (code: any) => {
            this.resetProcess();
        });

    };

    private getCommand = (): SpawnCommand => {

        const serveScript = PackageJson.getScript(`serve`);
        if (serveScript !== undefined && serveScript.toLowerCase().startsWith(`ng serve`)) {
            return this.getCommandFromString(serveScript);
        }

        const startScript = PackageJson.getScript(`start`);
        if (startScript !== undefined && startScript.toLowerCase().startsWith(`ng serve`)) {
            return this.getCommandFromString(startScript);
        }

        return {
            command: `ng`,
            args: [`serve`]
        };
    };

    private getCommandFromString = (command: string): SpawnCommand => {
        const commandParts = command.split(` `);
        const commandName = commandParts[0];
        const commandArgs = commandParts.slice(1);

        // Replace the port property if specified in the command
        const portIndex = commandArgs.findIndex((arg: string) => arg.includes(`--port`));
        if (portIndex >= 0) {
            if (commandArgs.length > portIndex + 1) {
                ServeCommand.port = parseInt(commandArgs[portIndex + 1]);
            }
            else if (commandArgs[portIndex].includes(`=`)) {
                ServeCommand.port = parseInt(commandArgs[portIndex].split(`=`)[1]);
            }
        }

        return {
            command: commandName,
            args: commandArgs
        };
    };

    private findPIDAndKill = () => {

        const netstatProcess = spawn('netstat', ['-a', `-n`, `-o`], {
            shell: true,
            cwd: Store.rootPath
        });

        netstatProcess.stdout.on('data', (data: any) => {
            const lines = data.toString().split('\n');
            const angularLine = lines.find((line: string) => line.includes(`:${ServeCommand.port}`));

            if (angularLine) {
                const pid = angularLine.split(' ').filter((item: string) => item.length > 0)[4];
                this.killPID(pid);
            }
        });

        netstatProcess.stderr.on('data', (data: any) => {
            console.log(data.toString());
        });

    };

    private killPID = (pid: string) => {

        const killProcess = spawn('taskkill', ['/PID', pid, '/F'], {
            shell: true,
            cwd: Store.rootPath
        });

        killProcess.stderr.on('data', (data: any) => {
            console.error(data.toString());
        });

        killProcess.on('close', (code: any) => {
            if (ServeCommand.process?.killed === true) {
                this.runProcess();
            }
        });

    };

    private resetProcess = (kill: boolean = false) => {

        if (kill) {
            ServeCommand.process?.kill();
            this.findPIDAndKill();
        }

        ServeCommand.status = false;
        ServeCommand.process = undefined;
    };

}