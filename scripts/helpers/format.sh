#!/bin/bash

colSize=20

function formatJobTitle {
  echo "[$1]"
  echo
}

function formatEnvVar {
  key=$1
  value=$(eval echo \$"${key}")
  color="32"
  if   [ "$value" == "" ];  then color="34"; value="unset"
  elif [ "$value" == "1" ]; then color="32"
  elif [ "$value" == "0" ]; then color="35"
  else value="'$value'"
  fi
  printf " %-${colSize}s\\e[2;${color}m%s\\e[1;0m\\n" "$key" "$value"
}

function formatGeneric {
  printf " %-${colSize}s\\e[0;2m%s\\e[0m\\n" "$1" "$2"
}

function formatDiscret {
  printf "\\e[2;34m%s\\e[2;0m\\n" "$1"
}

function formatSkip {
  printf "\\e[2;34m[-] skipping %s (%s)\\e[0;0m\\n" "$1" "$2"
}

function clearLine {
  echo -en "\\r\\e[0K"
}

function formatError {
  printf "\\e[0;31m[✘] %s\\e[0;0m\\n" "$1"
}

function formatProgress {
  printf "\\e[0;35m[⬇] %s\\e[0;0m" "$1"
}

function formatSuccess {
  printf "\\e[0;36m[✔] %s\\e[0;0m\\n" "$1"
}
