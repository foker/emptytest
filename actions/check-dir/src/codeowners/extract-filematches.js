const ignore = require('ignore');

function extractFileMatches(files, ownersInfo) {
    return files.reduce((acc, cur) => {
        const cleanPath = cur.replace('./', '');
        const ruleMatch = Object.keys(ownersInfo)
            .reverse()
            .find((owner) => ignore().add(owner).ignores(cleanPath));
        if (!ruleMatch) {
            return acc;
        }
        const owners = ownersInfo[ruleMatch];
        acc[cur] = { ruleMatch, owners };
        return acc;
    }, {});
}

module.exports = extractFileMatches;
