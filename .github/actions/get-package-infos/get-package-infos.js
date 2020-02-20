const core = require("@actions/core");
const semver = require("semver");
const pkg = require("../../../package.json");

async function main() {
  const { version } = semver.coerce(pkg.version);

  core.setOutput("version", pkg.version);
  core.setOutput("clean", version);
  core.setOutput("name", pkg.name);
}

main().catch(err => core.setFailed(err.message));
