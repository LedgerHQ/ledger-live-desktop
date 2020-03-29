const { Octokit } = require("@octokit/rest");

class Draft {
  constructor(repo, tag, token) {
    this.repo = repo;
    this.tag = tag;
    this.octokit = new Octokit({ auth: token });
  }

  async check() {
    const { repo, tag, octokit } = this;

    // Due to a limitation form GH API, we can't fetch a draft release
    // by its tag (via eg octokit.repos.getReleaseByTag())
    // So we fetch the latest releases and loop on that 🤷‍♂️
    const { data } = await octokit.repos.listReleases(repo);

    for (const release of data) {
      if (release.tag_name === tag) {
        if (release.draft) {
          return true;
        }

        throw new Error(`A release tagged ${tag} exists but is not a draft.`);
      }
    }
    return false;
  }

  async create() {
    const { repo, tag, octokit } = this;
    const params = {
      ...repo,
      tag_name: tag,
      name: tag,
      draft: true,
      prerelease: true,
    };

    const { status } = await octokit.repos.createRelease(params);

    if (status !== 201) {
      throw new Error(`Got HTTP status ${status} when trying to create the release draft.`);
    }
  }
}

module.exports = Draft;
