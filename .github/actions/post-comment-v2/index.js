const core = require("@actions/core");
const fetch = require("isomorphic-unfetch");

const main = async () => {
  const comment = core.getInput("comment");
  const sha = core.getInput("sha");

  await fetch(
    `http://github-actions-live-vercel.vercel.app/api/comment/v2?owner=LedgerHQ&repo=ledger-live-desktop&sha=${sha}`,
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
