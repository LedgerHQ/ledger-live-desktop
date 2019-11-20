#!/bin/bash

allMatches=()
failed=0

find src/icons/ -type f -name '*.js' | while read f; do
  if grep -q "<defs>" "${f}"; then
    matches=($(grep -Eo 'id="[a-zA-Z0-9_\-]+"' ${f} | cut -c4- | sed 's/"//g'))
    for match in "${matches[@]}"
    do
      if [[ " ${allMatches[@]} " =~ " ${match} " ]]; then
        failed=1
        echo "SVG def with id '${match}' in ${f} is not unique."
      else
        allMatches+=(${match})
      fi
    done
  fi
  if [ $failed -eq 1 ]; then
    echo "┌────────────────────────────────────────────────────────────────────┐"
    echo "│      The above warnings represent cases where an id collision      │"
    echo "│     has been detected. This can potentially break the rendering    │"
    echo "│           of the SVG, and we don't want that now, do we?           │"
    echo "│                                                                    │"
    echo "│               Add a prefix to the ids inside <defs>                │"
    echo "└────────────────────────────────────────────────────────────────────┘"
    exit 1
  fi
done

