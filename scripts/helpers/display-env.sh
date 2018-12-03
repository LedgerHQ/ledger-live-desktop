#!/bin/bash

# shellcheck disable=SC1091
source scripts/helpers/format.sh

if [ "$GIT_REVISION" == "" ]; then
  GIT_REVISION=$(git rev-parse HEAD)
fi

if [[ $(uname) == 'Darwin' ]]; then
  osVersion="$(sw_vers -productName) $(sw_vers -productVersion)"
else
  osVersion="$(uname -srmo)"
fi

echo
printf " │ \\e[4;1m%s\\e[0;0m\\n"  "Ledger Live Desktop - ${GIT_REVISION}"
printf " │ \\e[1;30m%s\\e[1;0m\\n"        "${osVersion}"
printf " │ \\e[2;1mcommit \\e[0;33m%s\\e[0;0m\\n" "$(git rev-parse HEAD)"
echo

formatEnvVar "CI"
formatEnvVar "NODE_ENV"
formatEnvVar "JOBS"

echo
formatGeneric "node" "$(node --version)"
echo
