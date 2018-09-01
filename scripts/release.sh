#!/usr/bin/env bash

unset PREFIX
source ~/.bashrc

set -e

# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

# shellcheck disable=SC1091
source scripts/helpers/display-env.sh

# if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
#   echo "You are not on master. Exiting properly. (CI)"
#   exit 0
# fi

# if ! git describe --exact-match --tags 2>/dev/null >/dev/null; then
#   echo "You are not on a tag. Exiting properly. (CI)"
#   exit 0
# fi

 if [ -z "$GH_TOKEN" ]; then
   echo "GH_TOKEN is unset. can't release" >&2
   exit 1
 fi

 if [ ! -d "static/fonts/museosans" ]; then
   if ! command -v aws ; then
     if [[ $(uname) == 'Darwin' ]]; then echo 'you are on MacOS' && runJob "brew install awscli" "installing aws cli..." "installed aws cli" "failed to install aws cli"
   elif [[ $(uname) == 'Linux' ]]; then echo 'you are on Linux' && runJob "sudo apt install awscli" "installing aws cli..." "installed aws cli" "failed to install aws cli"
   else echo 'you are on Windows' && runJob "pip install awscli" "installing aws cli..." "installed aws cli" "failed to install aws cli"
     fi
   fi

if [[ $(uname) == 'Darwin' ]]; then
      # Create keychain
   runJob \
      "security create-keychain -p 'circle' circle.keychain ;\
      security list-keychain -d user -s login.keychain circle.keychain ;\
      security unlock-keychain -p circle circle.keychain"\
      "adding circle keychain..." "keychain added" "keychain creation failed" "verbose"

      # Add certificate to keychain
    runJob \
       "aws s3 cp s3://ledger-ledgerlive-resources-dev/resources/CertificatesLL.p12 /tmp/CertificatesLL.p12 ;\
       security import /tmp/CertificatesLL.p12 -f pkcs12 -k circle.keychain -P $MACOS_CERTIFICATE_PASSWORD" \
       "adding certificates..." "certificates added" "failed to add certificates" "verbose"
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

# if ! git diff-index --quiet HEAD --; then
#   echo "you have uncommitted local changes!" >&2
#   exit 1
# fi


# originRemote=$(git config --get remote.origin.url)
# if [ "$originRemote" != "git@github.com:LedgerHQ/ledger-live-desktop.git" ]; then
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

runJob \
  "DEBUG=electron-builder electron-builder build --publish always" \
  "building, packaging and publishing app..." \
  "app built, packaged and published successfully" \
  "failed to build app" \
  "verbose"
