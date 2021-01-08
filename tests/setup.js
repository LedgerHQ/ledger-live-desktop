import rimraf from "rimraf";
import path from "path";
import fs from "fs";

module.exports = () => {
  // ...
  rimraf.sync(path.join(__dirname, "coverage"));
  fs.mkdirSync(path.join(__dirname, "coverage"), { recursive: true });
};
