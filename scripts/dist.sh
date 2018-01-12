#/bin/bash

NODE_ENV=production webpack --config webpack/internals.config.js &&
yarn compile
