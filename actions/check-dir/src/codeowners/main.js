import path from 'path';
// import fs from 'fs';
import * as core from '@actions/core';
import extractCodeOwners from 'src/codeowners/extract-codeowners';
import extractFileMatches from 'src/codeowners/extract-filematches';
import { getVersionControlledFiles } from 'src/codeowners/utils';

// const filepath = './codeowner-information.json';

async function extractCodeOwnerInfo(codeownerPath, fileMatchInfo) {
    try {
        let results = {};
        const filePath = path.join(
            process.env.GITHUB_WORKSPACE || './',
            codeownerPath,
        );
        const codeownerInfo = await extractCodeOwners(filePath);
        core.setOutput('codeowners', JSON.stringify(codeownerInfo));
        results = { codeownerInfo };

        if (fileMatchInfo) {
            const versionControlledFiles = await getVersionControlledFiles();
            const fileMatches = extractFileMatches(
                versionControlledFiles,
                codeownerInfo,
            );

            core.setOutput('filematches', JSON.stringify(fileMatches));
            results = { codeownerInfo, fileMatches };
        }

        return results;
    } catch (error) {
        core.setFailed(error.message);
    }
}

const codeownerPath = core.getInput('path') || './CODEOWNERS';
const fileMatchInfo = core.getInput('file_match_info').toLowerCase() === 'true';

extractCodeOwnerInfo(codeownerPath, fileMatchInfo);
