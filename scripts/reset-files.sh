#!/bin/bash

set -e

echo "> Getting user data folder..."

TMP_FILE=`mktemp`
cat <<EOF > $TMP_FILE
const { app } = require('electron')
console.log(app.getPath('userData'))
EOF
USER_DATA_FOLDER=`timeout --preserve-status 0.5 electron $TMP_FILE || echo` # echo used to ensure status 0
rm $TMP_FILE

read -p "> Remove folder \"$USER_DATA_FOLDER\"? (y/n) " -n 1 -r
echo
if [[ $REPLY == "y" ]]
then
  rm -rf "$USER_DATA_FOLDER"
else
  echo "> Nothing done. Bye"
fi
