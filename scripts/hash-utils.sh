#!/bin/bash

function GET_HASH_PATH {
  HASH_NAME=$1
  echo "./node_modules/.cache/LEDGER_HASH_$HASH_NAME.hash"
}

function GET_HASH {
  HASH_NAME=$1
  HASH_PATH=$(GET_HASH_PATH "$HASH_NAME")
  if [ ! -e "$HASH_PATH" ]; then
    echo ''
  else
    HASH_CONTENT=$(cat "$HASH_PATH")
    echo "$HASH_CONTENT"
  fi
}

function SET_HASH {
  HASH_NAME=$1
  HASH_CONTENT=$2
  echo "setting hash $HASH_NAME to $HASH_CONTENT"
  HASH_PATH=$(GET_HASH_PATH "$HASH_NAME")
  mkdir -p ./node_modules/.cache
  echo "$HASH_CONTENT" > "$HASH_PATH"
}
