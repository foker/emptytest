import { exec } from 'child_process';
import fs from 'fs';

const listVersionControlledFilesCommand = 'git ls-tree HEAD -r --name-only';

export async function getVersionControlledFiles() {
    return new Promise((resolve, reject) => {
        exec(listVersionControlledFilesCommand, (err, stdout, stderr) => {
            if (err != null) reject(err);
            if (typeof stderr !== 'string') reject(stderr);
            resolve(stdout.split(/\r?\n/).filter(Boolean));
        });
    });
}

export async function getFileContents(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
