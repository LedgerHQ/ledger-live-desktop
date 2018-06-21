#/bin/bash

set -e

export GIT_REVISION=`git rev-parse HEAD`
export SENTRY_URL=https://db8f5b9b021048d4a401f045371701cb@sentry.io/274561

rm -rf ./node_modules/.cache dist
yarn
NODE_ENV=production webpack-cli --mode production --config webpack/internals.config.js
NODE_ENV=production electron-webpack
