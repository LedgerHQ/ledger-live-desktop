#!/bin/sh -l

Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
sleep 2
rm -rf node_modules
yarn --frozen-lockfile
yarn ci
yarn build
if [ -n "$1" -a "$1" = '1' ]; then yarn spectron -u; else yarn spectron; fi