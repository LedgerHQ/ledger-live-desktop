const child_process = require("child_process");
const fs = require("fs");

const path = "tests/docker-electron-webdriver/";

const hashes = ["../../package.json", "../../yarn.lock", "yarn.js"]
  .map(f => child_process.execSync(`shasum ${path}${f}`).toString())
  .join(",");

const lastYarn = fs
  .readFileSync(`${path}.lastyarn`, {
    flag: "as+",
  })
  .toString();

console.log("lastYarn", lastYarn);
console.log("lastUpdates", hashes);

const needBuild = lastYarn !== hashes;

if (needBuild) {
  console.log("needs to reyarn");
  const spawn = child_process.spawnSync("yarn --frozen-lockfile", {
    stdio: "inherit",
    shell: true,
  });
  if (spawn.status !== 0) {
    console.log("error yarning");
  } else {
    fs.writeFileSync(`${path}.lastyarn`, hashes, {
      flag: "w",
    });
    console.log("yarn ok");
  }
} else {
  console.log("yarn ok");
}
