#!/bin/bash

# shellcheck disable=SC1091
source scripts/helpers/format.sh

appVersion=$(grep version package.json | sed 's/.*"\(.*\)",$/\1/')

echo
printf " │ \\e[4;1m%s\\e[0;0m\\n"  "Ledger Live Desktop - ${appVersion}"
printf " │ \\e[1;30m%s\\e[1;0m\\n"        "$(uname -srmo)"
printf " │ \\e[2;1mcommit \\e[0;33m%s\\e[0;0m\\n" "$(git rev-parse HEAD)"
echo

formatEnvVar "CI"
formatEnvVar "NODE_ENV"
formatEnvVar "JOBS"

echo
formatGeneric "node" "$(node --version)"
echo
