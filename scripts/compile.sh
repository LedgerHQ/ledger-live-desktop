#!/bin/bash

set -e

# shellcheck disable=SC1091
source scripts/helpers/format.sh
# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

GIT_REVISION=$(git rev-parse HEAD)
export GIT_REVISION

export SENTRY_URL='https://db8f5b9b021048d4a401f045371701cb@sentry.io/274561'
export JOBS='max'

echo
formatEnvVar 'GIT_REVISION'
formatEnvVar 'SENTRY_URL'
echo

runJob \
  "clearing dist..." \
  "dist cleared" \
  "failed to clear dist" \
<<EOF
rm -rf dist
EOF

runJob \
  "building internal bundle..." \
  "internal bundle built" \
  "failed to build internal bundle" \
<<EOF
NODE_ENV=production yarn run webpack-cli --mode production --config webpack/internals.config.js
EOF

runJob \
  "building main & renderer bundles..." \
  "main & renderer bundles built" \
  "failed to build main & renderer bundles" \
<<EOF
NODE_ENV=production yarn run electron-webpack
EOF
