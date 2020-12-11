const core = require("@actions/core");

const main = async () => {
  const images = core.getInput("images");
  const runId = core.getInput("runId");
  const testoutput = core.getInput("testoutput");
  const lintoutput = core.getInput("lintoutput");
  const fullrepo = core.getInput("fullrepo").split("/");
  const imgArr = JSON.parse(images);

  let str = "";
  if (imgArr.length) {
    imgArr.map(image => {
      str += image.name + "\n\n";
      str += "![](" + image.link + ")\n\n";
    });
    // from what I understood it's a bit cumbersome to get the artifact url before the workflow finishes
    // so this is a workaround. the endpoint will redirect to the artifact url.
    // https://github.com/machard/github-action-artifact-redirect
    str += `[Suggested snapshots to update](https://github-action-artifact-link.vercel.app/api?owner=${fullrepo[0]}&repo=${fullrepo[1]}&runId=${runId})`;
  }

  const lintFailed = (lintoutput || "").indexOf("exit code 255") >= 0;
  const testsFailed = (testoutput || "").indexOf("FAIL") >= 0;
  const imgDiffFailed = !!imgArr.length;

  str = `
<details>
<summary><b>Lint outputs ${lintFailed ? "❌" : " ✅"}</b></summary>
<p>

${lintoutput}

</p>
</details>

<details>
<summary><b>Tests outputs ${testsFailed ? "❌" : " ✅"}</b></summary>
<p>

${testoutput}

</p>
</details>

<details>
<summary><b>Diff output ${imgDiffFailed ? "❌" : " ✅"}</b></summary>
<p>

${str}

</p>
</details>  
`;

  core.setOutput("body", str);
};

main().catch(err => core.setFailed(err));
