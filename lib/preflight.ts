import * as fs from 'fs';
import { exit } from 'process';
import * as syncDir from 'sync-directory';

interface PipeParameters {
    readonly commit: string
    readonly appPath: string
    readonly artifactDir: string
}

export class Preflight {
    constructor(pipeParameters: PipeParameters) {
        this.createDirectoryStructure(pipeParameters.commit, pipeParameters.appPath, pipeParameters.artifactDir);
    };

    createDirectoryStructure (commit: string, appPath: string, artifactDir: string): string {
        // Directory structure
        const dir = `${artifactDir}/${commit}`;
        try{
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir, {recursive: true});
            }
        } catch(err) {
            console.error(`creating directory structure(${dir}): ${err}`);
            exit(-1);
        }

        // Copy asserts
        console.log(`Dir: ${dir} | APP: ${appPath}`)
        try{
            syncDir.default(appPath, dir);
        } catch (err) {
            console.error(`syncing assets to deployment folder (${dir}): ${err}`);
            exit(-1);
        }
        return dir;
    }
}