#!/bin/bash

# shellcheck disable=SC1091
source scripts/helpers/format.sh

function _getHashPath {
  HASH_NAME=$1
  echo "./node_modules/.cache/LEDGER_HASH_$HASH_NAME.hash"
}

function getHash {
  HASH_NAME=$1
  HASH_PATH=$(_getHashPath "$HASH_NAME")
  if [ ! -e "$HASH_PATH" ]; then
    echo ''
  else
    HASH_CONTENT=$(cat "$HASH_PATH")
    echo "$HASH_CONTENT"
  fi
}

function setHash {
  HASH_NAME=$1
  HASH_CONTENT=$2
  formatSuccess "$HASH_NAME hash set to $HASH_CONTENT"
  HASH_PATH=$(_getHashPath "$HASH_NAME")
  mkdir -p ./node_modules/.cache
  echo "$HASH_CONTENT" > "$HASH_PATH"
}

function hashDiffers {
  cachedHash=$(getHash "$1")
  hash=$2
  if [ "$cachedHash" == "$hash" ]; then
    return 1
  else
    return 0
  fi
}
