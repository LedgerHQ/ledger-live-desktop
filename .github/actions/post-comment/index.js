const core = require("@actions/core");
const fetch = require("isomorphic-unfetch");

const main = async () => {
  const comment = core.getInput("comment");
  const prNumber = core.getInput("prNumber");

  await fetch(
    `http://github-action-artifact-link.vercel.app/api/comment?owner=LedgerHQ&repo=ledger-live-desktop&issueId=${prNumber}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: comment,
    },
  );
};

main().catch(err => core.setFailed(err));
