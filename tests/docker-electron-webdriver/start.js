const child_process = require("child_process");
const fs = require("fs");
const { files } = require("./dockerfiles");

const path = "tests/docker-electron-webdriver/";

const hashes = files.map(f => child_process.execSync(`shasum ${path}${f}`).toString()).join(",");

const lastBuild = fs
  .readFileSync(`${path}.lastbuild`, {
    flag: "as+",
  })
  .toString();

console.log("lastBuild", lastBuild);
console.log("lastUpdates", hashes);

const needBuild = lastBuild !== hashes;

if (needBuild) {
  console.log("needs to rebuild");
  try {
    fs.unlinkSync(`${path}.lastyarn`);
  } catch {}
  child_process.spawn(
    `cd ${path} && docker-compose up --build ${process.argv
      .slice(2)
      .join(" ")} --force-recreate --renew-anon-volumes`,
    {
      stdio: "inherit",
      shell: true,
    },
  );
} else {
  console.log("restarting hopefully existing container");
  child_process.spawn(`cd ${path} && docker-compose up ${process.argv.slice(2).join(" ")}`, {
    stdio: "inherit",
    shell: true,
  });
}
