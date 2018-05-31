#!/usr/bin/env bash

set -e

if [ -z "$GH_TOKEN" ]; then
  echo "GH_TOKEN is unset. can't release" >&2
  exit 1
fi

if ! git diff-index --quiet HEAD --; then
  echo "you have uncommitted local changes!" >&2
  exit 1
fi

# TODO check if version is not already there
# TODO check if local git HEAD is EXACTLY our remote master HEAD

export SENTRY_URL=https://db8f5b9b021048d4a401f045371701cb@sentry.io/274561
yarn compile
build
