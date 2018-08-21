#!/bin/bash

curl -X POST \
  https://api.github.com/repos/Arnaud97234/ledger-live-desktop/releases?access_token=bfa5c3ca6689ee1c609621aa9bf30f30c70bc961 \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	"tag_name": "v0.0.2",
	"target_commitish": "circleci-QA",
	"name": "0.0.2",
	"draft": false,
	"prerelease": true
}'
