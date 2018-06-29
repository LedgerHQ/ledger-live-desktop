#!/bin/bash

set -e

GIT_REVISION=`git rev-parse HEAD`
SENTRY_URL=https://db8f5b9b021048d4a401f045371701cb@sentry.io/274561
NODE_ENV=production

rm -rf ./node_modules/.cache dist
JOBS=max yarn
yarn run webpack-cli --mode production --config webpack/internals.config.js
yarn run electron-webpack
