# Ledger Live (desktop) [![CircleCI](https://circleci.com/gh/LedgerHQ/ledger-live-desktop.svg?style=svg)](https://circleci.com/gh/LedgerHQ/ledger-live-desktop) [![Crowdin](https://d322cqt584bo4o.cloudfront.net/ledger-wallet/localized.svg)](https://crowdin.com/project/ledger-wallet)

<img src="/static/docs/ledgerLogo.png" width="200"/>

> Ledger Live Desktop is a new generation Ledger Wallet application build with React, Redux and Electron to run natively on the web. The main goal of the app is to provide our users with a single wallet for all crypto currencies supported by our devices. To learn more check out [Ledger](https://www.ledgerwallet.com/?utm_source=redirection&utm_medium=variable)

## Architecture

From one side Ledger Desktop app connected to the Blockchain via the in-house written C++ library - LibCore and from the other it communicates to the Ledger Hardware Device to securely sign all transactions.

<p align="center">
 <img src="/static/docs/architecture.png" width="550"/>
</p>

**Related repositories:**

- [ledgerjs](https://github.com/LedgerHQ/ledgerjs)
- [live-common](https://github.com/LedgerHQ/ledger-live-common)
- [ledger-core-node-bindings](https://github.com/LedgerHQ/lib-ledger-core-node-bindings)
- [ledger-core](https://github.com/LedgerHQ/lib-ledger-core)

## Setup

### Requirements

- [NodeJS](https://nodejs.org) LTS
- [Yarn](https://yarnpkg.com) LTS
- [Python](https://www.python.org/) v2.7.10 (used by [node-gyp](https://github.com/nodejs/node-gyp) to build native addons)
- You will also need a C++ compiler

### Optional

- In the application we use `Museo Sans` font. To include it in the app, you need to have a zip file `museosans.zip` which you should extract and place inside the `static/fonts/museosans` directory

## Install

1.  Clone or fork the repo

```bash
git clone git@github.com:LedgerHQ/ledger-live-desktop.git
```

2.  Install dependencies

```bash
yarn
```

## Run

Launch the app

```bash
yarn start
```

## Build

```bash
# Build & package the whole app
# Creates a .dmg for Mac, .exe installer for Windows, or .AppImage for Linux
# Output files will be created in dist/ folder
yarn dist
```

**Note:** Use `yarn dist:dir` to speed up the process: it will skip the packaging step. Handy for debugging builds. You can also use `BUNDLE_ANALYZER=1 yarn dist:dir` to generate [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) report.

---

## Config (optional helpers)

### Environment variables

(you can use a .env or export environment variables)

```bash
DEV_TOOLS_MODE=bottom # devtools position Options: right, bottom, undocked, detach
HIDE_DEV_WINDOW=0

## flags for development purpose
DEBUG_DEVICE=1
DEBUG_NETWORK=1
DEBUG_COMMANDS=1
DEBUG_DB=1
DEBUG_ACTION=1
DEBUG_TAB_KEY=1
DEBUG_LIBCORE=1
DEBUG_WS=1
LEDGER_RESET_ALL=1
LEDGER_DEBUG_ALL_LANGS=1
SKIP_GENUINE=1
SKIP_ONBOARDING=1
SHOW_LEGACY_NEW_ACCOUNT=1
HIGHLIGHT_I18N=1

## constants
GET_CALLS_TIMEOUT=30000
GET_CALLS_RETRY=2
SYNC_MAX_CONCURRENT=6
SYNC_BOOT_DELAY=2000
SYNC_ALL_INTERVAL=60000
CHECK_APP_INTERVAL_WHEN_INVALID=600
CHECK_APP_INTERVAL_WHEN_VALID=1200
CHECK_UPDATE_DELAY=5000
DEVICE_DISCONNECT_DEBOUNCE=500
```

### Launch storybook

We use [storybook](https://storybook.js.org/) for UI development.

```bash
yarn storybook
```

### Run code quality checks

```bash
yarn lint                # launch eslint
yarn prettier            # launch prettier
yarn flow                # launch flow
yarn test                # launch unit tests
```

### Programmatically reset app files

```bash
# clear the dev electron user data directory
# it remove sqlite db, accounts, settings
# useful to start from a fresh state

yarn reset-files
```

## File structure

```
.
├── dist : output folder generate by the build
├── scripts : commands (for building, releasing,...)
├── src
│   ├── internals : code that run on the 'internal' thread.
│   ├── main : code that run on the 'main' thread.
│   ├── renderer : code that run on the 'renderer' thread
│   ├── components : all the React components
|       └── modals : sub levels for the modals
│   ├── api : related to HTTP APIs
│   ├── bridge : an abstraction on top of blockchains apis (libcore / js impls)
│   ├── commands : an abstraction to run code over the internal thread
│   ├── icons : all the icons of our app, as React components.
│   ├── config : contains the constants,...
│   ├── helpers : generic folder for our business logic (might be reorganized in the future)
│   ├── middlewares : redux middlewares
│   ├── actions : redux actions
│   ├── reducers : redux reducers
│   ├── sentry : for our bug tracker
│   ├── stories : for storybook
│   ├── styles : theme
│   ├── logger.js : abstraction for all our console.log s
│   └── types : global flow types
├── static
│   ├── docs
│   ├── fonts
│   ├── i18n
│   ├── images
│   └── videos
├── webpack : build configuration
└── yarn.lock
```
