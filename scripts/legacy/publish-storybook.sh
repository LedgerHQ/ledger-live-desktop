#!/bin/bash

set -e

rm -rf storybook-static
STORYBOOK_ENV=1 ./node_modules/.bin/build-storybook
mkdir -p storybook-static/static/fonts/opensans storybook-static/static/fonts/rubik
cp -R static/fonts/opensans storybook-static/static/fonts
cp -R static/fonts/rubik storybook-static/static/fonts

cd storybook-static

git init
git remote add origin git@github.com:LedgerHQ/ledger-live-desktop.git
git add .
git commit -m 'deploy storybook'
git push -f origin master:gh-pages

printf "deployed with success!"
