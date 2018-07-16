#!/bin/bash

set -e

# shellcheck disable=SC1091
source scripts/helpers/format.sh
# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

if [ "$GIT_REVISION" == "" ]; then
  GIT_REVISION=$(git rev-parse HEAD)
fi
export GIT_REVISION

export SENTRY_URL='https://db8f5b9b021048d4a401f045371701cb@sentry.io/274561'
export JOBS='max'

echo
formatEnvVar 'GIT_REVISION'
formatEnvVar 'SENTRY_URL'
echo

runJob \
  "rm -rf dist" \
  "clearing dist..." \
  "dist cleared" \
  "failed to clear dist"

runJob \
  "NODE_ENV=production yarn run webpack-cli --mode production --config webpack/internals.config.js" \
  "building internal bundle..." \
  "internal bundle built" \
  "failed to build internal bundle"

runJob \
  "NODE_ENV=production yarn run electron-webpack" \
  "building main & renderer bundles..." \
  "main & renderer bundles built" \
  "failed to build main & renderer bundles"
