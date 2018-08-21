#!/bin/bash

curl -s POST /repos/Arnaud97234/ledger-live-desktop/release \
-d '{
  "tag_name": "v0.0.1",
  "name": "0.0.1",
  "draft": "true",
  "prerelease": true
}'
