#!/bin/bash

if [ -z "$ANALYTICS_KEY" ]; then
  echo 'ANALYTICS_KEY must be set'
  exit 1
fi

cd "$(dirname "$0")/.." || exit

wget https://cdn.segment.com/analytics.js/v1/"$ANALYTICS_KEY"/analytics.min.js -O static/analytics.min.js
