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
  latestFlowTypedCommitHash=$(curl --silent --header "Accept: application/vnd.github.VERSION.sha" --location https://api.github.com/repos/flowtype/flow-typed/commits/master)
  clearLine

  if [[ $latestFlowTypedCommitHash =~ ^\{ ]]; then
    formatError "Failed to retrieve flow-typed definitions"
    echo "$latestFlowTypedCommitHash"
    exit 1
  else
    if hashDiffers flow-typed "$latestFlowTypedCommitHash"; then
      installFlowTyped
    else
      formatSkip "flow-typed installation" "already up-to-date"
    fi
  fi

  echo

}

function installFlowTyped {
  runJob \
    "flow-typed install -s --overwrite" \
    "Installing flow-typed definitions..." \
    "Installed flow-typed definitions" \
    "Failed installing flow-typed definitions"

  runJob \
    "rm flow-typed/npm/{react-i18next_v7.x.x.js,styled-components_v3.x.x.js,redux_*,winston*}" \
    "Removing broken flow-typed definitions" \
    "Removed broken flow-typed definitions" \
    "Failed removing broken flow-typed definitions"

  setHash flow-typed "$latestFlowTypedCommitHash"
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
