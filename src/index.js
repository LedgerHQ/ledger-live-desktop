if (process.env.SPECTRON_RUN && !process.env.SPECTRON_DISABLE_MOCK_TIME) {
  const timemachine = require("timemachine");
  timemachine.config({
    dateString: require("../tests/time").default,
  });
}

if (!process.env.IS_INTERNAL_PROCESS) {
  // Main electron thread
  require("./main");
} else {
  // Internal thread (libcore, hardware)
  require("./internal");
}
