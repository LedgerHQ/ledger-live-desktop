module.exports = {
  /* transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  // testURL: 'http://localhost/', */
  globals: {
    __DEV__: false,
    __APP_VERSION__: "2.0.0",
  },
  globalSetup: "<rootDir>/tests/setup.js",
  setupFiles: ["<rootDir>/tests/jestSetup.js"],
  transformIgnorePatterns: ["/node_modules/(?!(@polkadot|@babel/runtime)/)"],
};
