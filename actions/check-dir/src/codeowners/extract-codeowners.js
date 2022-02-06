const { getFileContents } = require('./utils');

const codeownersRe = new RegExp('^[^#](.*)$', 'mg');

async function extractCodeOwners(path, byAuthor) {
    const contents = await getFileContents(path);
    const lines = contents.match(codeownersRe);
    if (!lines) {
        return {};
    }
    const res = lines.reduce((acc, cur) => {
        const [key, value] = cur.split(/(?<=^\S+)\s/);
        if (!key || !value) return acc;
        acc[key] = value.split(/ /).filter(Boolean);
        return acc;
    }, {});

    if (byAuthor) {
        return Object.keys(res).filter((key) => res[key].includes(byAuthor));
    }

    return res;
}

module.exports = extractCodeOwners;
