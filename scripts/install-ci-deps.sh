#!/bin/bash

source scripts/hash-utils.sh

PACKAGE_JSON_HASH=`md5sum package.json | cut -d ' ' -f 1`
CACHED_PACKAGE_JSON_HASH=`GET_HASH 'package.json'`

if [ "$CACHED_PACKAGE_JSON_HASH" == "$PACKAGE_JSON_HASH" ]; then
  echo "> Skipping yarn install"
else
  yarn install
  SET_HASH 'package.json' $PACKAGE_JSON_HASH
fi
