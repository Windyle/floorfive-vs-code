import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Store } from '../../store';

export class BuildWatchCommand {

    private status: boolean = false;
    private process: ChildProcessWithoutNullStreams | undefined;

    public execute = () => {

        this.status = !this.status;

        if (this.status) {

            // Run the process
            this.process = spawn('ng', [`build`, `--watch`], {
                shell: true,
                cwd: Store.rootPath
            });

            // Listen for data
            this.process.stdout.on('data', (data: any) => {
                console.log(data.toString());
            });

            // Listen for errors
            this.process.stderr.on('data', (data: any) => {
                console.log(data.toString());
            });

            // Listen for close
            this.process.on('close', (code: any) => {
                console.log(`Process closed with code ${code}`);
                this.process = undefined;
            });

        } else {

            // Kill the process
            if (this.process) {
                this.process.kill();
                this.process = undefined;
            }

        }
    };

}