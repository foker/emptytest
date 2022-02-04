import { getFileContents } from 'src/codeowners/utils';

const codeownersRe = new RegExp('^[^#](.*)$', 'mg');

async function extractCodeOwners(path) {
    const contents = await getFileContents(path);
    const lines = contents.match(codeownersRe);
    if (!lines) {
        return {};
    }
    return lines.reduce((acc, cur) => {
        const [key, value] = cur.split(/(?<=^\S+)\s/);
        if (!key || !value) return acc;
        acc[key] = value.split(/ /).filter(Boolean);
        return acc;
    }, {});
}

export default extractCodeOwners;
