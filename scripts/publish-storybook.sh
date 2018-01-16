#!/bin/bash

set -e

rm -rf storybook-static
./node_modules/.bin/build-storybook
cd storybook-static
git init
git remote add origin git@github.com:LedgerHQ/ledger-wallet-desktop.git
git add .
git commit -m 'deploy storybook'
git push -f origin master:gh-pages
printf "deployed with success!"
