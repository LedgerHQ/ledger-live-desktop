#!/bin/bash

# shellcheck disable=SC1091
source scripts/helpers/format.sh

operatingSystem=$(uname -s)
if [ "$operatingSystem" != Linux* ] && [ "$operatingSystem" != Darwin* ]; then
  operatingSystem="Windows"
fi

function runJob {

  job=$1
  progressMsg=$2
  successMsg=$3
  errMsg=$4
  logLevel=$5

  # let's absolutely don't take care of this fake os
  if [ "$operatingSystem" == "Windows" ]; then
    local tmpScript=$(mktemp)
    echo $job > "$tmpScript"
    bash "$tmpScript"
    rm "$tmpScript"
    return $?
  fi

  tmpErrFile=$(mktemp)

  formatProgress "$progressMsg"

  if [ "$logLevel" == "verbose" ]; then
    echo
    echo "$job" | bash &
  else
    echo "$job" | bash >/dev/null 2>"$tmpErrFile" &
  fi

  childPid=$!

  # prevent set -e to exit if child fail
  wait $childPid && returnCode=$? || returnCode=$?

  if [ "$logLevel" != "verbose" ]; then
    clearLine
  fi

  if [ $returnCode -eq 0 ]; then
    formatSuccess "$successMsg"
  else
    formatError "$errMsg"
    formatError "$(cat "$tmpErrFile")"
  fi

  rm "$tmpErrFile"
  return $returnCode
}
