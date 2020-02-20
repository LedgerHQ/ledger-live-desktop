const babelPlugins = require("./babel.plugins");

module.exports = api =>
  api.env("test")
    ? {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                electron: "7.1.9",
                node: "current",
              },
              modules: "commonjs",
            },
          ],
          "@babel/preset-react",
          "@babel/preset-flow",
        ],
        plugins: [
          ...babelPlugins,
          [
            "module-resolver",
            {
              alias: {
                "^~/(.+)": "./src/\\1",
              },
            },
          ],
        ],
      }
    : {};
