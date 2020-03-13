const core = require("@actions/core");

const main = () => {
  const username = core.getInput("username", { required: true });
  const ban = core.getInput("ban", { required: true });

  console.log(username);
  console.log(ban);

  if (username === ban) {
    core.setFailed(`${ban} is not allowed to trigger this CI`);
    process.exit();
  }
};

main();
