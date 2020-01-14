#!/bin/bash

# get app version
ledgerLiveVersion=$(grep version package.json | cut -d : -f 2 | sed -E 's/.*"([^"]*)".*/\1/g')

# OS settings
if [[ $(uname) == 'Darwin' ]]; then \
  settingsPath=~/Library/Application\ Support/Ledger\ Live/
  appPath="/Applications/Ledger Live.app/Contents/MacOS/Ledger Live"
elif [[ $(uname) == 'Linux' ]]; then \
  settingsPath="$HOME/.config/Ledger Live"
  appPath="$HOME/apps/ledger-live-desktop-$ledgerLiveVersion-linux-x86_64.AppImage"
else \
  settingsPath="%AppData\\Roaming\\Ledger Live"
  appPath="C:\\Program Files\\Ledger Live\\Ledger Live.exe"
fi

# clean Ledger Live Application settings directory
rm -rf "$settingsPath"
mkdir "$settingsPath"

# Copy app.json init file for testing
cp test-e2e/sync/data/empty-app.json "$settingsPath/app.json"

# Start Ledger Live Desktop app
"$appPath" &
lastPid=$!

# wait for sync
electron ./test-e2e/sync/wait-sync.js
returnCode=$?

# kill Ledger Live Desktop process
kill -9 $lastPid

if [[ $returnCode = 0 ]]; then
  echo "[OK] Sync finished"
else
  echo "[x] Sync failed"
  exit 1
fi

# Copy app.json file to test folder
cp "$settingsPath"/app.json test-e2e/sync/data/actual-app.json

# compare new app.json with expected_app.json
./node_modules/.bin/jest test-e2e/sync/sync-accounts.spec.js
