#!/bin/bash

# Patch .AppImage to address libcore crash on some
# distributions, due to loading system libraries
# instead of embedded ones.
#
# see https://github.com/LedgerHQ/ledger-live-desktop/issues/1010

set -e

BASE_URL=http://mirrors.kernel.org/ubuntu/pool/main/k/krb5
PACKAGE_SUFFIX=-2build1_amd64.deb
TMP_DIR=$(mktemp -d)
LEDGER_LIVE_VERSION=$(grep version package.json | sed -E 's/.*: "(.*)",/\1/g')

cp "dist/ledger-live-desktop-$LEDGER_LIVE_VERSION-linux-x86_64.AppImage" "$TMP_DIR"
pushd "$TMP_DIR"

declare -a LIBRARIES=(
  "libgssapi-krb5-2_1.16"
  "libk5crypto3_1.16"
  "libkrb5-3_1.16"
  "libkrb5support0_1.16"
)

for PACKAGE in "${LIBRARIES[@]}"; do
  curl -fOL "$BASE_URL/$PACKAGE$PACKAGE_SUFFIX"
  ar p "$PACKAGE$PACKAGE_SUFFIX" data.tar.xz | tar xvJf >/dev/null - ./usr/lib/x86_64-linux-gnu/
  rm "$PACKAGE$PACKAGE_SUFFIX"
done

curl -fOL "https://s3-eu-west-1.amazonaws.com/ledger-ledgerlive-resources-dev/public_resources/appimagetool-x86_64.AppImage"

cp "$OLDPWD/scripts/shasums/patch-appimage-sums.txt" .
sha512sum --quiet --check patch-appimage-sums.txt || exit 1

./ledger-live-desktop-"$LEDGER_LIVE_VERSION"-linux-x86_64.AppImage --appimage-extract
cp -a usr/lib/x86_64-linux-gnu/*.so.* squashfs-root/usr/lib

chmod +x appimagetool-x86_64.AppImage
./appimagetool-x86_64.AppImage squashfs-root "$OLDPWD/dist/ledger-live-desktop-$LEDGER_LIVE_VERSION-linux-x86_64.AppImage"

popd

MD5_SUM=$(sha512sum "dist/ledger-live-desktop-$LEDGER_LIVE_VERSION-linux-x86_64.AppImage" | cut -f1 -d\ | xxd -r -p | base64 | paste -sd "")
sed -i "s|sha512: .*|sha512: ${MD5_SUM}|g" dist/latest-linux.yml

SIZE=$(stat --printf="%s" "dist/ledger-live-desktop-$LEDGER_LIVE_VERSION-linux-x86_64.AppImage")
sed -i "s|size: .*|size: ${SIZE}|g" dist/latest-linux.yml
