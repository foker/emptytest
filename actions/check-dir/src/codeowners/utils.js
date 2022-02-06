const { exec } = require('child_process');
const fs = require('fs');

const listVersionControlledFilesCommand = 'git ls-tree HEAD -r --name-only';

module.exports.getVersionControlledFiles = async function() {
    return new Promise((resolve, reject) => {
        exec(listVersionControlledFilesCommand, (err, stdout, stderr) => {
            if (err != null) reject(err);
            if (typeof stderr !== 'string') reject(stderr);
            resolve(stdout.split(/\r?\n/).filter(Boolean));
        });
    });
}


module.exports.getFileContents = async function(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
