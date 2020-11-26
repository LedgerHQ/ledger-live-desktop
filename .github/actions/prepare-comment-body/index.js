const core = require("@actions/core");

const main = async () => {
  const images = core.getInput("images");
  const imgArr = JSON.parse(images);

  let str = "";
  if (imgArr.length) {
    imgArr.map(image => {
      str += "![](" + image + ")<br/>";
    });
  }
  core.setOutput("body", str);
};

main().catch(err => core.setFailed(err));
