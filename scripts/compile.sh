#!/bin/bash

set -e

GIT_REVISION=$(git rev-parse HEAD)
export GIT_REVISION
export SENTRY_URL=https://db8f5b9b021048d4a401f045371701cb@sentry.io/274561
export JOBS=max

rm -rf ./node_modules/.cache dist
yarn
NODE_ENV=production yarn run webpack-cli --mode production --config webpack/internals.config.js
NODE_ENV=production yarn run electron-webpack
