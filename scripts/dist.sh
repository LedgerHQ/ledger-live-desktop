#/bin/bash

rm -rf dist &&
NODE_ENV=production webpack-cli --config webpack/internals.config.js &&
electron-webpack
