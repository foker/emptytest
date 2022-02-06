const core = require("@actions/core");
const github = require("@actions/github");

const getCodeOwners = require('./src/codeowners/main');
const getDiffSet = require('./src/diff-set/main');

async function run() {
    try {
        const payloadContext = github.context.payload;
        const user = payloadContext.pull_request.user.login;
        const permittedDirectories = await getCodeOwners(user);
        const diffset = await getDiffSet();
        console.log(permittedDirectories);
        const res = diffset.filter((file) => {
            return !permittedDirectories.some((dir) => `/${file}`.startsWith(dir));
        });

        if (!res.length) {
            return false;
        }

        core.error(`user ${user} doesn't have enough permissions to edit next files: ${res.join(', ')}`)
    } catch (error) {
        core.setFailed(error.message);
    }
}

function failIfMissing(val, errorMessage){
    if(!val){
        throw new Error(errorMessage);
    }
}

run();