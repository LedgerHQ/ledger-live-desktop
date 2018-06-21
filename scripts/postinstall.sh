#/bin/bash

source scripts/hash-utils.sh

function MAIN {
  if ! $CI; then
    REBUILD_ELECTRON_NATIVE_DEPS
  fi
  INSTALL_FLOW_TYPED
}

function INSTALL_FLOW_TYPED {
  LATEST_FLOW_TYPED_COMMIT_HASH=`curl --silent --header "Accept: application/vnd.github.VERSION.sha" https://api.github.com/repos/flowtype/flow-typed/commits/master`
  CURRENT_FLOW_TYPED_HASH=`GET_HASH 'flow-typed'`
  if [ "$LATEST_FLOW_TYPED_COMMIT_HASH" == "$CURRENT_FLOW_TYPED_HASH" ]; then
    echo "> Flow-typed definitions are up to date. Skipping"
  else
    echo "> Installing flow-typed defs"
    flow-typed install -s --overwrite
    echo "> Removing broken flow definitions"
    rm flow-typed/npm/{react-i18next_v7.x.x.js,styled-components_v3.x.x.js,redux_*}
    SET_HASH 'flow-typed' $LATEST_FLOW_TYPED_COMMIT_HASH
  fi
}

function REBUILD_ELECTRON_NATIVE_DEPS {
  # for strange/fancy os-es
  if [[ `uname` == 'Darwin' ]]; then
    PACKAGE_JSON_HASH=`md5 package.json | cut -d ' ' -f 1`
  else
    # for normal os-es
    PACKAGE_JSON_HASH=`md5sum package.json | cut -d ' ' -f 1`
  fi
  CACHED_PACKAGE_JSON_HASH=`GET_HASH 'package.json'`
  if [ "$CACHED_PACKAGE_JSON_HASH" == "$PACKAGE_JSON_HASH" ]; then
    echo "> Electron native deps are up to date. Skipping"
  else
    echo "> Installing electron native deps"
    electron-builder install-app-deps
    SET_HASH 'package.json' $PACKAGE_JSON_HASH
  fi
}

MAIN
