#!/bin/bash

# hilarious fix: to make linux icon we have to remove icon.png from build folder
# some context:
#   - https://github.com/electron-userland/electron-builder/issues/2577
#   - https://github.com/electron-userland/electron-builder/issues/2269
if [[ $(uname) == 'Linux' ]]; then
  mv build/icon.png /tmp
fi

yarn compile && DEBUG=electron-builder electron-builder

# hilarious fix continuation: put back the icon where it was
if [[ $(uname) == 'Linux' ]]; then
  mv /tmp/icon.png build
fi
