const core = require("@actions/core");
const { context } = require("@actions/github");

async function main() {
  const { ref } = context;
  const re = /refs\/pull\/(\d+)\/merge/;
  const match = re.exec(ref);

  if (match) {
    core.setOutput("pr", match[1]);
  } else {
    throw new Error("not on a PR");
  }
}

main().catch(err => core.setFailed(err.message));
