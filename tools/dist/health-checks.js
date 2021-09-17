const git = require("git-rev-sync");
const pkg = require("../../package.json");
const repoInfo = require("./repo-info");

let verbose = false;

const log = str => {
  if (verbose) {
    console.log(`[health-checks] ${str}`);
  }
};

const isClean = () => {
  const isDirty = git.isDirty();

  log(`git.isDirty(): ${isDirty}`);

  if (isDirty) {
    throw new Error("You have uncommitted local changes");
  }
};

const isTagged = nightly => ctx => {
  const isTagDirty = git.isTagDirty();

  log(`git.isTagDirty(): ${isTagDirty}`);

  const tag = git.tag();

  log(`git.tag(): ${tag}`);

  if ((isTagDirty && !nightly) || !tag) {
    throw new Error("HEAD is not tagged or dirty");
  }

  ctx.tag = tag;
};

const checkRemote = nightly => ctx => {
  const { repository } = pkg;
  const gitRemote = git.remoteUrl();

  log(`package.json repository is ${repository}, git remote is ${gitRemote}`);

  const pkgInfo = repoInfo(repository);
  const gitInfo = repoInfo(gitRemote);

  if (nightly) {
    ctx.repo = pkgInfo;
    return;
  }

  if (pkgInfo.owner !== gitInfo.owner || pkgInfo.repo !== gitInfo.repo) {
    throw new Error("git remote URL does not match package.json `repository` entry");
  }

  ctx.repo = pkgInfo;
};

const checkEnv = nightly => ctx => {
  const platform = require("os").platform();

  const { GH_TOKEN, APPLEID, APPLEID_PASSWORD } = process.env;

  if (!GH_TOKEN) {
    throw new Error("GH_TOKEN is not set");
  }

  log("GH_TOKEN is set");

  ctx.token = GH_TOKEN;

  if (!nightly) {
    if (platform !== "darwin") {
      log("OS is not mac, skipping APPLEID and APPLEID_PASSWORD check");
      return;
    }

    if (!APPLEID || !APPLEID_PASSWORD) {
      throw new Error("APPLEID and/or APPLEID_PASSWORD are not net");
    } else {
      log("APPLEID and APPLEID_PASSWORD are set");
    }
  }
};

module.exports = args => {
  verbose = !!args.verbose;

  return [
    {
      title: "Check for required environment variables",
      task: checkEnv(args.nightly),
    },
    {
      title: "Check that git remote branch matches package.json `repository`",
      task: checkRemote(args.nightly),
    },
    {
      title: "Check that the local git repository is clean",
      task: isClean,
      skip: () => !!args.nightly,
    },
    {
      title: "Check that HEAD is tagged",
      task: isTagged(args.nightly),
    },
  ];
};
