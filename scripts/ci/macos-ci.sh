#!/bin/bash


set -e

# shellcheck disable=SC1091
source scripts/helpers/run-job.sh

# shellcheck disable=SC1091
source scripts/helpers/display-env.sh

echo "unset PREFIX" >> ~/.bashrc
source ~/.bashrc

runJob "yarn lint" "executing lint..." "lint success" "lint failed" "verbose"

runJob "yarn flow" "executing flow..." "flow success" "flow failed" "verbose"

runJob "yarn test" "executing unit tests..." "Unit tests success" "unit tests failed" "verbose"
