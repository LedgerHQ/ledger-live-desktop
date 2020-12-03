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
      return upload(file);
    }
  };

  let files;
  try {
    files = fs.readdirSync(fullPath, { withFileTypes: true });
    files = files.filter(f => f.isFile()).map(f => f.name);
  } catch {
    return core.setOutput("images", []);
  }

  const resultsP = files.map(file => {
    const img = fs.readFileSync(`${fullPath}/${file}`);
    return upload(img);
  });

  const results = await Promise.all(resultsP);
  const res = results.map((link, index) => {
    return {
      link,
      name: files[index].replace("-diff.png", ""),
    };
  });

  core.setOutput("images", res);
};

uploadImage().catch(err => {
  core.setFailed(err);
});
