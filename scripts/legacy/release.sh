#!/usr/bin/env bash

set -e

if [ -z "$GH_TOKEN" ]; then
  echo "GH_TOKEN is unset. can't release" >&2
  exit 1
fi

if [ ! -d "static/fonts/museosans" ]; then
  echo "static/fonts/museosans is required for a release" >&2
  exit 1
fi

if ! git diff-index --quiet HEAD --; then
  echo "you have uncommitted local changes!" >&2
  exit 1
fi

# TODO check if version is not already there
# TODO check if local git HEAD is EXACTLY our remote master HEAD

yarn compile
DEBUG=electron-builder yarn run electron-builder build --publish always
