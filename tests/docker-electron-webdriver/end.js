const child_process = require("child_process");
const fs = require("fs");
const { files } = require("./dockerfiles");

const path = "tests/docker-electron-webdriver/";

const hashes = files.map(f => child_process.execSync(`shasum ${path}${f}`).toString()).join(",");

fs.writeFileSync(`${path}.lastbuild`, hashes, {
  flag: "w",
});
