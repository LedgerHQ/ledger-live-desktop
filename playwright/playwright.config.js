const config = {
  use: {
    headless: false,
    viewport: { width: 580, height: 300 },
    ignoreHTTPSErrors: true,
    //timeout doesn't seem to have much effect. Needs `--timeout=60000` in the command line
    timeout: 60000,
  },
};

module.exports = config;
