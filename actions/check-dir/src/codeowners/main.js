const path = require('path');
const core = require('@actions/core');
const extractCodeOwners = require('./extract-codeowners');
const extractFileMatches = require('./extract-filematches');
const { getVersionControlledFiles } = require('./utils');

// const filepath = './codeowner-information.json';

async function extractCodeOwnerInfo(codeownerPath, fileMatchInfo, byAuthor) {
    try {
        let results = {};
        const filePath = path.join(
            process.env.GITHUB_WORKSPACE || './',
            codeownerPath,
        );
        const codeownerInfo = await extractCodeOwners(filePath, byAuthor);
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

module.exports = (byAuthor) => extractCodeOwnerInfo(codeownerPath, fileMatchInfo, byAuthor);
