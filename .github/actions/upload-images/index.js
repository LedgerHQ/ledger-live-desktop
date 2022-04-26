const fetch = require("isomorphic-unfetch");
const core = require("@actions/core");
const fs = require("fs");
const FormData = require("form-data");
const { resolve } = require("path");

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const uploadImage = async () => {
  const path = core.getInput("path");
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
    console.log(files);
  } catch {
    return core.setOutput("images", []);
  }

  const resultsP = files.map(async file => {
    const img = fs.readFileSync(`${file}`);
    return upload(img);
  });

  const results = await Promise.all(resultsP);
  const res = results.map((link, index) => {
    return {
      link,
      name: files[index].replace("-diff.png", ""),
    };
  });

  core.setOutput("images", JSON.stringify(res));
};

uploadImage().catch(err => {
  core.setFailed(err);
});
