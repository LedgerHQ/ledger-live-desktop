if (process.env.SPECTRON_RUN) {
  const timemachine = require("timemachine");
  timemachine.config({
    dateString: "March 14, 2018 13:34:42",
  });
}

if (!process.env.IS_INTERNAL_PROCESS) {
  // Main electron thread
  require("./main");
} else {
  // Internal thread (libcore, hardware)
  require("./internal");
}
