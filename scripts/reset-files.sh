#!/bin/bash

set -e

echo "> Getting user data folder..."

TMP_FILE=$(mktemp)
cat <<EOF > "$TMP_FILE"
const { app } = require('electron')
console.log(app.getPath('userData'))
EOF
USER_DATA_FOLDER=$(timeout 0.5 electron "$TMP_FILE" || echo) # echo used to ensure status 0

if [ "$USER_DATA_FOLDER" == "" ]; then
  echo "You probably are on a slow computer. Be patient..."
  USER_DATA_FOLDER=$(timeout 3 electron "$TMP_FILE" || echo) # echo used to ensure status 0
fi

if [ "$USER_DATA_FOLDER" == "" ]; then
  echo "Apparently, very very slow computer..."
  USER_DATA_FOLDER=$(timeout 6 electron "$TMP_FILE" || echo) # echo used to ensure status 0
fi

rm "$TMP_FILE"

if [ "$USER_DATA_FOLDER" == "" ]; then
  echo "Could not find the data folder. Bye"
  exit 0
fi

read -p "> Remove folder \"$USER_DATA_FOLDER\"? (y/n) " -n 1 -r
echo
if [[ $REPLY == "y" ]]
then
  rm -rf "$USER_DATA_FOLDER"
else
  echo "> Nothing done. Bye"
fi
