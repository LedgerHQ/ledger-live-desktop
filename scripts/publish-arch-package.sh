#!/bin/bash

set -e

# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

# shellcheck disable=SC1091
source scripts/helpers/display-env.sh

gitTag=$(git describe --tags)
tmpDir=$(mktemp -d)

runJob \
  "pushd build/linux/arch >/dev/null; makepkg --printsrcinfo > .SRCINFO; popd >/dev/null" \
  "creating .SRCINFO" \
  "successfully created .SRCINFO" \
  "error creating .SRCINFO"

runJob \
  "git clone ssh://aur@aur.archlinux.org/ledger-live.git ${tmpDir}" \
  "cloning AUR repository" \
  "cloned AUR repository" \
  "error cloning AUR repository"

runJob \
  "cp build/linux/arch/{ledger-live.desktop,PKGBUILD,.SRCINFO} \"${tmpDir}\"" \
  "copying files" \
  "copied files" \
  "error copying files"

# shellcheck disable=SC2164
cd "$tmpDir"

git add .
git commit -m "Build for ${gitTag}"

runJob \
  "git push origin master" \
  "pushing package" \
  "successfully pushed package" \
  "error pushing package"
