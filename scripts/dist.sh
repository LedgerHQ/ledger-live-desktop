#/bin/bash

rm -rf dist &&
NODE_ENV=production webpack-cli --mode production --config webpack/internals.config.js &&
NODE_ENV=production electron-webpack
