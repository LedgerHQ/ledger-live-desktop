#!/bin/bash

curl -X POST \
  https://github.com/Arnaud97234/ledger-live-desktop.git \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 686d5307-32e3-4098-804c-e6cf88ac4589' \
  -d '{
	"tag_name": "v0.0.1",
	"target_commitish": "circleci-QA",
	"name": "0.0.1",
	"draft": false,
	"prerelease": true
}'
