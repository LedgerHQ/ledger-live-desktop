#/bin/bash

concurrently --raw \
  "NODE_ENV=development webpack --watch --config webpack/internals.config.js" \
  "NODE_ENV=development electron-webpack dev"
