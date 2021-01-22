const core = require("@actions/core");

const main = async () => {
  const images = core.getInput("images");
  const runId = core.getInput("runId");
  const pullId = core.getInput("pullId");
  const from = core.getInput("from");
  const to = core.getInput("to");
  const author = core.getInput("author");
  let imgChanged = core.getInput("imgChanged").split("\n");
  if (imgChanged.length === 1 && imgChanged[0] === "") {
    imgChanged = [];
  }
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

  if (!lintFailed && !testsFailed && !imgDiffFailed && imgChanged.length) {
    imgChanged = imgChanged.map(
      img => `
${img}
![](https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/${from}/${img}) | ![](https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/${to}/${img})
|---|---
| Old | New
`,
    );
    const diffStr = imgChanged.join("\n\n");
    str += `

<details>
<summary><b>Updated/changed screenshots  :warning:</b></summary>
<p>

${diffStr}

</p>
</details>  
`;
  }

  const strSlack = `
Lint outputs ${lintFailed ? "❌" : " ✅"}
Tests outputs ${testsFailed ? "❌" : " ✅"}
Diff output ${imgDiffFailed ? "❌" : " ✅"}

https://github.com/LedgerHQ/ledger-live-desktop/commits/develop
`;

  const githubSlackMap = {
    machard: "U01DJR04M8Q",
    "juan-cortes": "UE1D1FS77",
    dasilvarosa: "UA14024H4",
    valpinkman: "U98KPAN86",
    MortalKastor: "U5FLVJ709",
    LFBarreto: "UR6U4QKKN",
    IAmMorrow: "UKFTXAZGF",
  };

  const strSlackAuthor = `
Lint outputs ${lintFailed ? "❌" : " ✅"}
Tests outputs ${testsFailed ? "❌" : " ✅"}
Diff output ${imgDiffFailed ? "❌" : " ✅"}

https://github.com/LedgerHQ/ledger-live-desktop/pull/${pullId}
`;

  core.setOutput("body", JSON.stringify({ comment: str.replace(/'/g, "'\\''") }));
  core.setOutput("bodyclean", str);
  if (lintFailed || testsFailed || imgDiffFailed) {
    core.setOutput("bodySlack", strSlack);
  } else {
    core.setOutput("bodySlack", "");
  }
  core.setOutput("bodySlackAuthor", strSlackAuthor);
  core.setOutput("slackAuthor", githubSlackMap[author] || "");
};

main().catch(err => core.setFailed(err));
