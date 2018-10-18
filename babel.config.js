const { NODE_ENV, CLI } = process.env

const __TEST__ = NODE_ENV === 'test'
const __CLI__ = !!CLI

module.exports = (api) => {

  if (api) {
    api.cache(true);
  }

  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          loose: true,
          modules: __TEST__ || __CLI__ ? 'commonjs' : false,
          targets: {
            electron: '1.8',
            node: 'current',
          },
        },
      ],
      require('@babel/preset-flow'),
      require('@babel/preset-react'),
    ],
    plugins: [
      [require('babel-plugin-module-resolver'), { root: ['src'] }],
      [
        require('babel-plugin-styled-components'),
        {
          displayName: true,
          ssr: __TEST__,
        },
      ],
      // Stage 0
      "@babel/plugin-proposal-function-bind",

      // Stage 1
      "@babel/plugin-proposal-export-default-from",
      "@babel/plugin-proposal-logical-assignment-operators",
      ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
      ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
      ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
      "@babel/plugin-proposal-do-expressions",

      // Stage 2
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      "@babel/plugin-proposal-function-sent",
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-proposal-throw-expressions",

      // Stage 3
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-syntax-import-meta",
      ["@babel/plugin-proposal-class-properties", { "loose": false }],
      "@babel/plugin-proposal-json-strings"
    ],
  }
}
