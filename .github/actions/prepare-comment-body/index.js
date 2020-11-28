const core = require("@actions/core");

const main = async () => {
  const images = core.getInput("images");
  const runId = core.getInput("runId");
  const fullrepo = core.getInput("fullrepo").split("/");
  const imgArr = JSON.parse(images);

  let str = "";
  if (imgArr.length) {
    imgArr.map(image => {
      str += image.name + "\n\n";
      str += "![](" + image.link + ")\n\n";
    });
    str += `[Suggested snapshots to update](http://github-action-artifact-link-eh13mcvc0.vercel.app/api?owner=${fullrepo[0]}&repo=${fullrepo[1]}&runId=${runId})`;
  }
  core.setOutput("body", str);
};

main().catch(err => core.setFailed(err));
