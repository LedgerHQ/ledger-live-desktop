#!/bin/bash

curl -s POST /repos/Arnaud97234/ledger-live-desktop/releases \
-d '{
  "tag_name": "v0.0.1",
  "name": "0.0.1",
  "draft": "false",
  "prerelease": "true"
}'
