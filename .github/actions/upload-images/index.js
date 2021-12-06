const fetch = require("isomorphic-unfetch");
const core = require("@actions/core");
const fs = require("fs");
const FormData = require("form-data");
const { resolve } = require("path");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const clean = str =>
  str
    .replace("-expected.png", "")
    .replace("-actual.png", "")
    .replace("-diff.png", "");

const isDiff = str => str.includes("diff");
const isActual = str => str.includes("actual");

const uploadImage = async () => {
  const path = core.getInput("path");
  const os = core.getInput("os");
  const workspace = core.getInput("workspace");
  const fullPath = resolve(path);

  const upload = async (file, i = 0) => {
    if (i > 2) {
      return "error";
    }
    const body = new FormData();
    body.append("type", "file");
    body.append("image", file);

    try {
      const res = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Client-ID 11eb8a62f4c7927`,
        },
        body,
      });

      const link = (await res.json()).data.link;
      if (!link) {
        throw new Error("no link");
      }
      return link;
    } catch (e) {
      await wait(3000);
      return upload(file, i + 1);
    }
  };

  const getAllFiles = currentPath => {
    let results = [];
    const dirents = fs.readdirSync(currentPath, { withFileTypes: true });
    dirents.forEach(dirent => {
      if (dirent.name.toLocaleLowerCase().includes("retry")) return;
      const newPath = resolve(currentPath, dirent.name);
      const stat = fs.statSync(newPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllFiles(newPath));
      } else {
        results.push(newPath);
      }
    });
    return results;
  };

  let files;
  try {
    files = getAllFiles(fullPath);
  } catch {
    return core.setOutput("images", []);
  }

  const resultsP = files.map(async file => {
    const img = fs.readFileSync(`${file}`);
    return upload(img);
  });

  const results = await Promise.all(resultsP);

  const formatted = {};
  results.forEach((link, index) => {
    const file = files[index];
    const key = clean(file);
    if (!formatted[key]) formatted[key] = { actual: {}, diff: {}, expected: {} };

    const subKey = isActual(file) ? "actual" : isDiff(file) ? "diff" : "expected";

    formatted[key][subKey].link = link;
    formatted[key][subKey].name = file;
  });

  const final = JSON.stringify(Object.values(formatted));

  console.log(final);

  fs.writeFileSync(`${workspace}/images-${os}.json`, final);
  core.setOutput("images", final);
};

uploadImage().catch(err => {
  core.setFailed(err);
});
