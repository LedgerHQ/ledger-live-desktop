const core = require("@actions/core");
const fetch = require("isomorphic-unfetch");
const { promises: fs } = require("fs");

const main = async () => {
  const imagesObject = await fs.readFile(core.getInput("images"));
  const lintoutput = await fs.readFile(core.getInput("lintoutput"), "utf8");
  const jestoutput = await fs.readFile(core.getInput("jestoutput"), "utf8");

  let str = "";
  let hasFailed = false;
  for (const platform of imagesObject) {
    const current = imagesObject[platform];
    if (Array.isArray(current) && current.length) {
      if (!hasFailed) hasFailed = true;
      str += `
        <strong>${platform}</strong>

        | Actual | Diff | Expected |
        |:------:|:----:|:--------:|
      `;
      current.forEach(({ actual, diff, expected }) => {
        str += `
          | ${actual.name} | ${diff.name} | ${expected.name} |
          | ![${actual.name}](${actual.link}) | ![${diff.name}](${diff.link}) | ![${expected.name}](${expected.link}) |
        `;
      });
      str += "\n\n";
    }
  }

  const lintFailed = (lintoutput || "").indexOf("exit code 255") >= 0;
  const jestFailed = (jestoutput || "").indexOf("FAIL") >= 0;
  const imgDiffFailed = !!hasFailed;

  // cc @${author}
  str = `

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
<summary><b>Diff output ${imgDiffFailed ? "❌" : " ✅"}</b></summary>
<p>

${str}

</p>
</details>
`;

  const strSlack = `
Lint outputs ${lintFailed ? "❌" : " ✅"}
Jest outputs ${jestFailed ? "❌" : " ✅"}
Diff output ${imgDiffFailed ? "❌" : " ✅"}

https://github.com/LedgerHQ/ledger-live-desktop/commits/develop
`;

  // const githubSlackMap = {
  //   machard: "U01DJR04M8Q",
  //   "juan-cortes": "UE1D1FS77",
  //   dasilvarosa: "UA14024H4",
  //   valpinkman: "U98KPAN86",
  //   MortalKastor: "U5FLVJ709",
  //   LFBarreto: "UR6U4QKKN",
  //   IAmMorrow: "UKFTXAZGF",
  // };

  const strSlackAuthor = `
Lint outputs ${lintFailed ? "❌" : " ✅"}
Jest outputs ${jestFailed ? "❌" : " ✅"}
Diff output ${imgDiffFailed ? "❌" : " ✅"}

`;
  // https://github.com/LedgerHQ/ledger-live-desktop/pull/${pullId}

  core.setOutput("bodySlack", strSlack);
  core.setOutput("bodySlackAuthor", strSlackAuthor);
  // core.setOutput("slackAuthor", githubSlackMap[author] || "");

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
