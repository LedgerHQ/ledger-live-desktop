const config = {
  use: {
    headless: false,
    viewport: { width: 580, height: 300 },
    ignoreHTTPSErrors: true,
    deviceScaleFactor: 1,
    // timeout doesn't seem to have much effect. Needs `--timeout=60000` in the command line
    timeout: 60000,
    reporter: [["json", { outputFile: "test-results.json" }]],
    screenshot: "only-on-failure",
  },
};

module.exports = config;
