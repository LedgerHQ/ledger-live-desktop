#/bin/bash

flow-typed install -s --overwrite
rm flow-typed/npm/{react-i18next_v7.x.x.js,styled-components_v3.x.x.js}
electron-builder install-app-deps
