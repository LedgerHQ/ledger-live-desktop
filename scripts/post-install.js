const chalk = require("chalk");
const hasha = require("hasha");
const execa = require("execa");
const fs = require("fs");
const child_process = require("child_process");

console.log("running");

const rebuildDeps = async (folder, file) => {
  await execa("yarn", ["install-deps"], {
    // env: { DEBUG: "electron-builder" },
  }).stdout.pipe(process.stdout);
  const checksum = await hasha.fromFile("yarn.lock", { algorithm: "md5" });
  console.log(chalk.blue("creating a new file with checksum"));
  if (fs.existsSync(folder)) {
    await fs.promises.writeFile(`${folder}${file}`, checksum);
  } else {
    await fs.promises.mkdir(folder, { recursive: true });
    await fs.promises.writeFile(`${folder}${file}`, checksum);
  }
  console.log(chalk.blue("file created"));
};

async function main() {
  const folder = "node_modules/.cache/";
  const file = "LEDGER_HASH_yarn.lock.hash";
  const fullPath = `${folder}${file}`;

  try {
    const oldChecksum = await fs.promises.readFile(fullPath, { encoding: "utf8" });
    const currentChecksum = await hasha.fromFile("yarn.lock", { algorithm: "md5" });
    if (oldChecksum !== currentChecksum) {
      rebuildDeps(folder, file);
    } else {
      console.log(chalk.blue("checksum are identical, no need to rebuild deps"));
    }
  } catch (error) {
    console.log(
      chalk.blue("no previous checksum saved, will rebuild native deps and save new checksum"),
    );
    try {
      await rebuildDeps(folder, file);
    } catch (error) {
      console.log(chalk.red("rebuilding error"));
    }
  }

  // when running inside the test electron container, there is no src.
  if (fs.existsSync("src")) {
    child_process.exec("bash ./scripts/sync-families-dispatch.sh");
  }
}

main();
