const core = require("@actions/core");
const fs = require("fs");

const filePath = "./package.json";

const main = async () => {
  if (fs.existsSync(filePath)) {
    try {
      const file = fs.readFileSync(filePath, "utf8");
      const json = JSON.parse(file);
      json.productName = `${json.productName} Beta`;
      fs.writeFileSync(filePath, JSON.stringify(json), { encoding: "utf8", flag: "w" });
    } catch (error) {
      core.setFailed(error);
    }
  }
};

main().catch(err => core.setFailed(err));
