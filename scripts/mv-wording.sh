#!/bin/bash
# change path of a wording in i18n files
# Usage: ./scripts/mv-wording.sh foo.bar foo.new.location

set -e
cd $(dirname $0)/..

OLD=$1
NEW=$2

if [ -z "$OLD" ] || [ -z "$NEW" ] ; then
  echo "Usage: ./scripts/mv-wording.sh foo.bar foo.new.location" >&2
  exit 1
fi

for f in static/i18n/*/app.json; do
  tmp=`mktemp`
  cat $f | jq ".$NEW=.$OLD | del(.$OLD)" > $tmp
  mv $tmp $f
done
