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

GH_TAG=$(git describe --exact-match --tags 2>/dev/null || echo '')

if [[ $GH_TAG == "" ]]; then
  echo "You are not on a tag. Exiting properly. (CI)"
  exit 0
fi

if [ -z "$GH_TOKEN" ]; then
  echo "GH_TOKEN is unset. can't release" >&2
  exit 1
fi

if [ ! -d "static/fonts/museosans" ]; then
  if ! command -v aws ; then
    if ! command -v apt ; then
      echo "Museo Sans is missing, and I can't fetch it (no aws, no apt)" >&2
      exit 1
    fi

    runJob "sudo apt install awscli" "installing aws cli..." "installed aws cli" "failed to install aws cli"
  fi

  runJob \
    "set -e ;\
    rm -rf /tmp/museosans* ;\
    aws s3 cp s3://ledger-ledgerlive-resources-dev/resources/museosans.zip /tmp/museosans.zip ;\
    unzip /tmp/museosans.zip -d /tmp/museosans ;\
    mv /tmp/museosans/museosans static/fonts ;\
    rm static/fonts/museosans/.DS_Store # remove crappy macOS file ;\
    rm -rf /tmp/museosans*" \
    "no museosans font. fetching it from private bucket..." \
    "successfully fetched museosans" \
    "error fetching museosans"
fi

if ! git diff-index --quiet HEAD --; then
  echo "you have uncommitted local changes!" >&2
  exit 1
fi

# originRemote=$(git config --get remote.origin.url)
# if [ "$originRemote" != "https://github.com/LedgerHQ/ledger-live-desktop.git" ]; then
#   echo "the origin remote is incorrect ($originRemote)"
#   exit 1
# fi

if [[ $(uname) == 'Linux' ]]; then # only run it on one target, to prevent race conditions
  runJob \
    "node scripts/create-draft-release.js" \
    "creating a draft release on GitHub (if needed)..." \
    "draft release ready" \
    "failed to create a draft release"
fi

runJob "yarn compile" "compiling..." "compiled" "failed to compile" "verbose"

if [[ $(uname) == 'Linux' ]]; then
  # --------------------------------------------------------------------
  #                     Linux: Internal process error (null)
  #
  # context: https://github.com/LedgerHQ/ledger-live-desktop/issues/1010
  # Linux: Internal process error (null)
  #
  # The "fix" is not optimal, as it doesn't really solve the problem
  # (electron loading system openssl before we can load our embedded one)
  # Quick summary:
  #
  #  - build without publishing
  #  - unpack the .AppImage
  #  - download reported working libs from ubuntu mirrors, put it inside
  #  - re-pack the .AppImage
  #  - checksum stuff
  #  - upload to gh

  runJob \
    "DEBUG=electron-builder electron-builder build --publish never" \
    "building and packaging app..." \
    "app built and packaged successfully" \
    "failed to build app" \
    "verbose"

  runJob \
    "scripts/patch-appimage.sh" \
    "patching AppImage..." \
    "AppImage patched successfully" \
    "failed to patch AppImage"

  LEDGER_LIVE_VERSION=$(grep version package.json | sed -E 's/.*: "(.*)",/\1/g')

  scripts/upload-github-release-asset.sh \
    github_api_token="$GH_TOKEN" \
    owner=LedgerHQ \
    repo=ledger-live-desktop \
    tag="$GH_TAG" \
    filename="dist/ledger-live-desktop-$LEDGER_LIVE_VERSION-linux-x86_64.AppImage"

  scripts/upload-github-release-asset.sh \
    github_api_token="$GH_TOKEN" \
    owner=LedgerHQ \
    repo=ledger-live-desktop \
    tag="$GH_TAG" \
    filename="dist/latest-linux.yml"

else
  runJob \
    "DEBUG=electron-builder electron-builder build --publish always" \
    "building and packaging app..." \
    "app built and packaged successfully" \
    "failed to build app" \
    "verbose"
fi
