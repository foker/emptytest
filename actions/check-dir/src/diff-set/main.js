import {
    setFailed, setOutput, debug, warning,
} from '@actions/core';
import { Octokit } from '@octokit/rest';
import throttlingPlugin from '@octokit/plugin-throttling';
import { env } from 'process';
import { GitHubDiff, sets } from 'src/diff-set/diff';
import { parseConfig, intoParams } from 'src/diff-set/util';

export default async function() {
    try {
        const config = parseConfig(env);
        Octokit.plugin(throttlingPlugin);
        const differ = new GitHubDiff(
            new Octokit({
                auth: config.githubToken,
                onRateLimit: (retryAfter, options) => {
                    warning(
                        `Request quota exhausted for request ${options.method} ${options.url}`,
                    );
                    if (options.request.retryCount === 0) {
                        // only retries once
                        warning(`Retrying after ${retryAfter} seconds!`);
                        return true;
                    }
                },
                onAbuseLimit: (retryAfter, options) => {
                    // does not retry, only logs a warning
                    warning(
                        `Abuse detected for request ${options.method} ${options.url}`,
                    );
                },
            }),
        );
        const diffset = await differ.diff(intoParams(config));
        setOutput('files', diffset.join(' '));
        return sets(config.fileFilters, diffset);
    } catch (error) {
        console.log(error);
        setFailed(error.message);
    }
}

run();
