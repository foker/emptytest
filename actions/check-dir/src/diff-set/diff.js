const { Minimatch } = require('minimatch');

export const sets = (filters, files) => Array.from(Object.entries(filters)).reduce(
    (filtered, [key, patterns]) => patterns.split(/\r?\n/).reduce((filtered, pattern) => {
        const matcher = new Minimatch(pattern);
        const matched = files.filter((file) => matcher.match(file));
        if (matched.length > 0) {
            filtered[key] = (filtered[key] || []).concat(matched);
        }
        return filtered;
    }, filtered),
    {},
);

const isDefined = (s) => {
    return s !== undefined;
};
export class GitHubDiff {
    github;

    constructor(github) {
        this.github = github;
    }

    async diff(params) {
        // if this is a merge to master push
        // base and head will both be the same
        if (params.base === params.head) {
            const commit = await this.github.repos.getCommit(params);
            return (
                commit.data.files
                    ?.filter((file) => file.status !== 'removed')
                    .map((file) => file.filename)
                    .filter(isDefined) || []
            );
        }
        const response = await this.github.repos.compareCommits({
            ...params,
            ref: undefined,
        });
        return response.data.files
            .filter((file) => file.status !== 'removed')
            .map((file) => file.filename);
    }
}
