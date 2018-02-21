#/bin/bash

rm -rf dist &&
NODE_ENV=production webpack --config webpack/internals.config.js &&
electron-webpack
