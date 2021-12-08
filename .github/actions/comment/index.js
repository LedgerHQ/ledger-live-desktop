const core = require("@actions/core");
const fetch = require("isomorphic-unfetch");
const { promises: fs } = require("fs");

const main = async () => {
  const images = core.getInput("images");
  const runId = core.getInput("runId");
  const pullId = core.getInput("pullId");
  const from = core.getInput("from");
  const to = core.getInput("to");
  const author = core.getInput("author");
  let imgChanged;
  try {
    imgChanged = (await fs.readFile(core.getInput("imgChanged"), "utf8")).split("\n");
    if (imgChanged.length === 1 && imgChanged[0] === "") {
      imgChanged = [];
    }
  } catch (e) {
    imgChanged = [];
  }
  const testoutput = await fs.readFile(core.getInput("testoutput"), "utf8");
  const lintoutput = await fs.readFile(core.getInput("lintoutput"), "utf8");
  const jestoutput = await fs.readFile(core.getInput("jestoutput"), "utf8");
  const fullrepo = core.getInput("fullrepo").split("/");
  const imgArr = JSON.parse(images);

  let str = "";
  if (imgArr.length) {
    imgArr.forEach(image => {
      str += image.name + "\n\n";
      str += "![](" + image.link + ")\n\n";
    });
    // from what I understood it's a bit cumbersome to get the artifact url before the workflow finishes
    // so this is a workaround. the endpoint will redirect to the artifact url.
    // https://github.com/machard/github-action-artifact-redirect
    str += `[Suggested snapshots to update](https://github-actions-live.ledger.tools/api?owner=${fullrepo[0]}&repo=${fullrepo[1]}&runId=${runId})`;
  }

  const lintFailed = (lintoutput || "").indexOf("exit code 255") >= 0;
  const testsFailed = (testoutput || "").indexOf("FAIL") >= 0;
  const jestFailed = (jestoutput || "").indexOf("FAIL") >= 0;
  const imgDiffFailed = !!imgArr.length;

  str = `
cc @${author}

<details>
<summary><b>Lint outputs ${lintFailed ? "❌" : " ✅"}</b></summary>
<p>

${lintoutput}

</p>
</details>

<details>
<summary><b>Tests outputs ${jestFailed ? "❌" : " ✅"}</b></summary>
<p>

${jestoutput}

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

  if (imgChanged.length) {
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
<summary><b>Screenshots diff with develop  :warning:</b></summary>
<p>

${diffStr}

</p>
</details>
`;
  }

  const strSlack = `
Lint outputs ${lintFailed ? "❌" : " ✅"}
Jest outputs ${jestFailed ? "❌" : " ✅"}
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
Jest outputs ${jestFailed ? "❌" : " ✅"}
Tests outputs ${testsFailed ? "❌" : " ✅"}
Diff output ${imgDiffFailed ? "❌" : " ✅"}

https://github.com/LedgerHQ/ledger-live-desktop/pull/${pullId}
`;

  core.setOutput("bodySlack", strSlack);
  core.setOutput("bodySlackAuthor", strSlackAuthor);
  core.setOutput("slackAuthor", githubSlackMap[author] || "");

  console.log(str);

  const sha = core.getInput("sha");

  await fetch(
    `https://github-actions-live.ledger.tools/api/comment/v2?owner=LedgerHQ&repo=ledger-live-desktop&sha=${sha}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: str }),
    },
  );
};

main().catch(err => core.setFailed(err));
