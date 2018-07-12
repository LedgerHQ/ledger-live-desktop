#!/bin/bash

set -e

# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

# shellcheck disable=SC1091
source scripts/helpers/display-env.sh

yarn compile

runJob \
  "DEBUG=electron-builder electron-builder --dir -c.compression=store -c.mac.identity=null" \
  "building app..." \
  "app built successfully" \
  "failed to build app" \
  "verbose"
