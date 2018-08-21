#!/bin/bash


latestRelease=$(curl -X GET \
  https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases/latest)

curl -X PATCH \
  https://api.github.com/repos/LedgerHQ/ledger-live-desktop/releases/${latestRelease.id} \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
        "draft": false,
        "prerelease": true
}'
