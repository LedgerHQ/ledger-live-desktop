#!/bin/bash

# shellcheck disable=SC1091
source scripts/helpers/hash.sh

yarnLockHash=$(md5sum package.json | cut -d ' ' -f 1)
cachedYarnLockHash=$(getHash 'yarn.lock')

if [ "$cachedYarnLockHash" == "$yarnLockHash" ]; then
  echo "> Skipping yarn install"
else
  yarn install
  setHash 'yarn.lock' "$yarnLockHash"
fi
