#!/bin/bash

# Fetch release binaries for all platforms
# and produce a .sha512sum file in the current folder

set -e
cd $(dirname $0)/..

[[ "$GH_TOKEN" == "" ]] && echo "GH_TOKEN is unset" && exit 1

repoPath=`node -e 'console.log(require("./package.json").repository.split("github.com/")[1])'`

function main {
  ASSETS_FILTER="(AppImage|zip|exe|dmg)"
  PKG_VER=$(grep version package.json | sed -E 's/.*: "(.*)",/\1/g')

  read -p "> release version ($PKG_VER): " -r RELEASE_VERSION
  RELEASE_VERSION=${RELEASE_VERSION:-$PKG_VER}
  OUTPUT_FILE="ledger-live-desktop-$RELEASE_VERSION.sha512sum"

  RELEASES=$(do_request "/repos/$repoPath/releases")
  printf """
  console.log(
    (%s).find(r => r.tag_name === 'v%s').assets
      .filter(a => a.name.match(/\\.%s$/))
      .map(a => a.browser_download_url)
      .join('\\\n')
  )
  """ "$RELEASES" "$RELEASE_VERSION" "$ASSETS_FILTER" >"$TMP_FILE1"
  node "$TMP_FILE1" | tee "$TMP_FILE2"

  pushd "$TMP_DIR" >/dev/null
  while IFS= read -r line ; do
    curl -L -O "$line"
  done < "$TMP_FILE2"
  if [[ "$(uname)" == "Darwin" ]]; then
    shasum -a 512 -- * > "$OLDPWD/$OUTPUT_FILE"
  else
    sha512sum -- * > "$OLDPWD/$OUTPUT_FILE"
  fi
  popd >/dev/null
}

TMP_DIR=$(mktemp -d)
TMP_FILE1=$(mktemp)
TMP_FILE2=$(mktemp)

function cleanup {
  rm -rf "$TMP_FILE1" "$TMP_FILE2" "$TMP_DIR"
}

function do_request {
  curl -H "Authorization: token $GH_TOKEN" "https://api.github.com$1"
}

trap cleanup EXIT
main
