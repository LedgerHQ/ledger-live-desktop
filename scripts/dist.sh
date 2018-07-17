#!/bin/bash

set -e

export JOBS=max

# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

# shellcheck disable=SC1091
source scripts/helpers/display-env.sh

# hilarious fix: to make linux icon we have to remove icon.png from build folder
# some context:
#   - https://github.com/electron-userland/electron-builder/issues/2577
#   - https://github.com/electron-userland/electron-builder/issues/2269
if [[ $(uname) == 'Linux' ]]; then
  runJob \
    "mv build/icon.png /tmp" \
    "dirty fix to handle linux icon..." \
    "successfully applied dirty fix to handle linux icon" \
    "failed to apply dirty fix to handle linux icon"
fi

yarn compile

runJob \
  "DEBUG=electron-builder electron-builder" \
  "building and packaging app..." \
  "app built and packaged successfully" \
  "failed to build app" \
  "verbose"

# hilarious fix continuation: put back the icon where it was
if [[ $(uname) == 'Linux' ]]; then
  runJob \
    "mv /tmp/icon.png build" \
    "cleaning dirty fix to handle linux icon..." \
    "successfully applied clean dirty fix to handle linux icon" \
    "failed to apply clean dirty fix to handle linux icon"
fi
