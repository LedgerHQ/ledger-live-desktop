#!/usr/bin/env bash

set -e

# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

# shellcheck disable=SC1091
source scripts/helpers/display-env.sh

if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "You are not on master. Exiting properly. (CI)"
  exit 0
fi

if ! git describe --exact-match --tags 2>/dev/null >/dev/null; then
  echo "You are not on a tag. Exiting properly. (CI)"
  exit 0
fi

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

runJob \
  "DEBUG=electron-builder electron-builder build --publish always" \
  "building, packaging and publishing app..." \
  "app built, packaged and published successfully" \
  "failed to build app" \
  "verbose"
