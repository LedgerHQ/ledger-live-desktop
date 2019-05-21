#!/bin/bash

set -e

export JOBS=max

# shellcheck disable=SC1091
source scripts/helpers/display-env.sh
# shellcheck disable=SC1091
source scripts/helpers/format.sh
# shellcheck disable=SC1091
source scripts/helpers/hash.sh
# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

latestFlowTypedCommitHash=''

function main {

  # native dependencies

  if hashDiffers yarn.lock "$(getYarnHash)"; then
    rebuildElectronNativeDeps
  else
    formatSkip "native module build" "already up-to-date"
  fi

  # flow-typed

  formatProgress "Checking if flow-typed definitions are up-to-date..."
  clearLine

  echo

}

function rebuildElectronNativeDeps {
  runJob \
    "DEBUG=electron-builder electron-builder install-app-deps" \
    "Building native electron dependencies..." \
    "Successfully builded native modules for electron" \
    "Build failed" \
    "verbose"
  setHash yarn.lock "$(getYarnHash)"
}

function getYarnHash {
  if [[ $(uname) == 'Darwin' ]]; then
    yarnHash=$(md5 yarn.lock | cut -d ' ' -f 1)
  else
    yarnHash=$(md5sum yarn.lock | cut -d ' ' -f 1)
  fi
  echo "$yarnHash"
}

main
