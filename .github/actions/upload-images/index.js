const fetch = require("isomorphic-unfetch");
const core = require("@actions/core");
const fs = require("fs");
const FormData = require("form-data");
const { resolve } = require("path");

const uploadImage = async () => {
  const path = core.getInput("path");
  const fullPath = resolve(path);

  // if (fs.existsSync(fullPath)) {
  //   throw new Error("the path provided does not exists");
  // }

  const upload = async file => {
    const body = new FormData();
    body.append("type", "file");
    body.append("image", file);

    const res = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Client-ID 11eb8a62f4c7927`,
      },
      body,
    });

    return res.json();
  };

  let files;
  try {
    files = fs.readdirSync(fullPath);
  } catch {
    return core.setOutput("images", []);
  }

  const resultsP = files.map(file => {
    const img = fs.readFileSync(`${fullPath}/${file}`);
    return upload(img);
  });

  const results = await Promise.all(resultsP);
  const res = results.map(r => {
    return r.data.link;
  });

  console.log(res);

  core.setOutput("images", res);
};

uploadImage().catch(err => {
  core.setFailed(err);
});
