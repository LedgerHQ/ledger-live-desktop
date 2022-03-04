
This document allows to track, explain and maintain the dependencies we have defined in package.json.

> "ideal frequency of update" gives a rough granularity: weekly (high prio to update often), monthly (regular update), quarter (no emergency but have to do), and "stable" means we don't need to update. When a library MUST not be updated or is blocked by something, we must indicate it.

### Direct Dependencies

| library name (what)    | description of its usage (why) | ideal frequency of update (when) / status |
|------------------------|--------------------------------|----------------------------------|
|@electron/remote        |                                |                                  |
|@hot-loader/react-dom   | developer experience           |                                  |
|@ledgerhq/devices       | devices data                   | weekly                           |
|@ledgerhq/electron-updater| manage Electron updates      | quarter                          |
|@ledgerhq/errors        | devices data                   | weekly                           |
|@ledgerhq/hw-transport  | device support                 | weekly                           |
|@ledgerhq/hw-transport-http| device developer experience | weekly                           |
|@ledgerhq/hw-transport-node-hid-singleton| device support| weekly                           |
|@ledgerhq/ledger-core   | libcore                        | DEPRECATED                       |
|@ledgerhq/live-common   | core Ledger library            | weekly                           |
|@ledgerhq/logs          | logs                           | weekly                           |
|@ledgerhq/react-ui      | UI components                  | weekly                           |
|@open-wc/webpack-import-meta-loader| ?                               |                               |
|@polkadot/react-identicon| Polkadot validator icons      |                                |
|@tippyjs/react          | ?                              |                                |
|@trust/keyto            | ?                              |                                |
|@xstate/inspect         | developer experience           |                                |
|@xstate/react           | React library for onboarding   |                                |
|animated                | ?                              |                                |
|async                   | ?                              |                                |
|axios                   | networking                     | monthly                        |
|bignumber.js            | amount helper                  | monthly                        |
|canvas-confetti         | onboarding confettis           |                                |
|chart.js                | Display graphs                 |                                |
|color                   | colors helper                  |                                |
|dotenv                  | manage process env             | monthly                        |
|electron-context-menu   | ?                              |                                |
|ethereumjs-tx           | FIXME: NOT USED                |                                |
|firebase                | ?                              |                                |
|focus-trap              | ?                              |                                |
|form-data               | ?                              |                                |
|fuse.js                 | ?                              |                                |
|getos                   | ?                              |                                |
|i18next                 | ?                              |                                |
|invariant               | ?                              |                                |
|ip                      | ?                              |                                |
|isomorphic-unfetch      | ?                              |                                |
|json-rpc-2.0            | ?                              |                                |
|jsqr                    | ?                              | monthly                        |
|lodash                  | ?                              |                                |
|lru-cache               | FIXME NOT USED                 |                                |
|measure-scrollbar       | ?                              |                                |
|moment                  | ?                              |                                |
|node-abi                | ?                              |                                |
|openpgp                 | ?                              |                                |
|os-locale               | ?                              |                                |
|os-name                 | ?                              |                                |
|prando                  | ?                              |                                |
|qrcode                  | ?                              |                                |
|qrloop                  | "LiveQR" to export accounts    | stable                         |
|qs                      | ?                              |                                |
|raven                   | ?                              |                                |
|raven-js                | ?                              |                                |
|react                   | core rendering library         | monthly                        |
|react-dom               | core rendering library         | monthly                        |
|react-hot-loader        | developer experience           |                                |
|react-i18next           |                                |                                |
|react-intersection-observer|                                |                                |
|react-key-handler       |                                |                                |
|react-lottie            |                                |                                |
|react-markdown          |                                |                                |
|react-motion            |                                |                                |
|react-prismazoom        |                                |                                |
|react-redux             |                                |                                |
|react-router-dom        |                                |                                |
|react-select            |                                |                                |
|react-spring            |                                |                                |
|react-transition-group  |                                |                                |
|react-virtualized-auto-sizer|                                |                                |
|react-window            |                                |                                |
|react-window-infinite-loader|                                |                                |
|redux                   |                                |                                |
|redux-actions           |                                |                                |
|redux-thunk             |                                |                                |
|reselect                |                                |                                |
|rimraf                  |                                |                                |
|rxjs                    |                                |                                |
|secp256k1               | used for auto update logic     | quarter                        |
|semver                  |                                |                                |
|sleep-promise           |                                |                                |
|smoothscroll-polyfill   |                                |                                |
|source-map-support      |                                |                                |
|styled-components       |                                |                                |
|styled-system           |                                |                                |
|timemachine             |                                |                                |
|tippy.js                |                                |                                |
|tree-kill               |                                |                                |
|uncontrollable          |                                |                                |
|uuid                    |                                |                                |
|winston                 |                                |                                |
|winston-transport       |                                |                                |
|write-file-atomic       |                                |                                |
|ws                      |                                |                                |
|xstate                  |                                |                                |
|zxcvbn                  |                                |                                |
