#/bin/bash

concurrently --raw \
  "cross-env NODE_ENV=development webpack --watch --config webpack/internals.config.js" \
  "cross-env NODE_ENV=development electron-webpack dev"
