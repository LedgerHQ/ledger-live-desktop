#!/bin/sh


if [ -z "$CROWDIN_TOKEN" ]; then
  echo "CROWDIN_TOKEN env required" >&2
  exit 1
fi

rm -rf xliffs
mkdir xliffs
cd xliffs

for lang in fr es-ES zh-CN ja ko ru; do
  curl "https://api.crowdin.com/api/project/ledger-wallet/export-file?file=develop/static/i18n/en/app.json&language=$lang&format=xliff&key=$CROWDIN_TOKEN" > en-$lang.xliff
done

zip -r ledger-live-langs.zip *.xliff
