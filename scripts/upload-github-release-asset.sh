#!/usr/bin/env bash
#
# Author: Stefan Buck
# License: MIT
# https://gist.github.com/stefanbuck/ce788fee19ab6eb0b4447a85fc99f447
#
#
# This script accepts the following parameters:
#
# * owner
# * repo
# * filename
# * github_api_token
#
# Script to upload a release asset using the GitHub API v3.
#
# Example:
#
# upload-github-release-asset.sh github_api_token=TOKEN owner=stefanbuck repo=playground filename=./build.zip
#

# Check dependencies.
set -e

# Validate settings.
[ "$TRACE" ] && set -x

# shellcheck disable=SC2124
CONFIG=$@

for line in $CONFIG; do
  eval "$line"
done

# Define variables.
GH_API="https://api.github.com"

# shellcheck disable=SC2154
GH_REPO="$GH_API/repos/$owner/$repo"

# shellcheck disable=SC2154
AUTH="Authorization: token $github_api_token"

# github_api_token=$GH_TOKEN owner=LedgerHQ repo=ledger-live-desktop tag=v1.2.2 filename=./dist/electron-builder-debug.yml
LATEST_RELEASE_ID=$(curl -sH "$AUTH" "$GH_API/repos/LedgerHQ/ledger-live-desktop/releases" | grep '"id":' | head -n 1 | sed -E 's/.*: (.*),/\1/')

# Validate token.
curl -o /dev/null -sH "$AUTH" "$GH_REPO" || { echo "Error: Invalid repo, token or network issue!";  exit 1; }

# Get ID of the asset based on given filename.
# shellcheck disable=SC2154
[ "$LATEST_RELEASE_ID" ] || { echo "Error: Failed to get release id"; exit 1; }

# Upload asset
echo "Uploading asset... "

# Construct url
# shellcheck disable=SC2154
GH_ASSET="https://uploads.github.com/repos/$owner/$repo/releases/$LATEST_RELEASE_ID/assets?name=$(basename "$filename")"

curl --data-binary @"$filename" -H "Authorization: token $github_api_token" -H "Content-Type: application/octet-stream" "$GH_ASSET"
