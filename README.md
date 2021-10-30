**[We are hiring, join us! 👨‍💻👩‍💻](https://jobs.lever.co/ledger/?department=Engineering)**


# Ledger Live (desktop) [![Crowdin](https://d322cqt584bo4o.cloudfront.net/ledger-wallet/localized.svg)](https://crowdin.com/project/ledger-wallet)

- Related: [ledger-live-mobile](https://github.com/ledgerhq/ledger-live-mobile)
- Backed by: [ledger-live-common](https://github.com/ledgerhq/ledger-live-common)

> Ledger Live is a new generation wallet desktop application providing a unique interface to maintain multiple cryptocurrencies for your Ledger Nano S / Blue. Manage your device, create accounts, receive and send cryptoassets, [...and many more](https://www.ledger.com/ledger-launches-ledger-live-the-all-in-one-companion-app-to-your-ledger-device).

<a href="https://github.com/LedgerHQ/ledger-live-desktop/releases">
  <p align="center">
    <img src="/docs/screenshot.png" width="550"/>
  </p>
 </a>

## Architecture

Ledger Live is an hybrid desktop application built with Electron, React, Redux, RxJS,.. and highly optimized with [ledger-core](https://github.com/LedgerHQ/lib-ledger-core) C++ library to deal with blockchains (sync, broadcast,..) via [ledger-core-node-bindings](https://github.com/LedgerHQ/lib-ledger-core-node-bindings). It communicates to Ledger hardware wallet devices (Nano X / Nano S / Blue) to verify address and sign transactions with [ledgerjs](https://github.com/LedgerHQ/ledgerjs). Some logic is shared with [live-common](https://github.com/LedgerHQ/ledger-live-common).

<p align="center">
 <img src="/docs/architecture.png" width="550"/>
</p>

## Download

The latest stable release is available on [ledger.com/ledger-live](https://www.ledger.com/ledger-live/).

Previous versions and pre-releases can be downloaded on here from the [Releases](https://github.com/LedgerHQ/ledger-live-desktop/releases) section.

### Compatibility
- macOS 10.14+
- Windows 8.1+ (x64)
- Linux (x64)

## Signed hashes

Ledger Live releases are signed. The automatic update mechanism makes use of the signature to verify that each subsequent update is authentic. Instructions for verifying the hash and signatures of the installation packages are available [on this page](https://ledger-live-tools.now.sh/lld-signatures), which will be integrated into the [official download page](https://www.ledger.com/ledger-live/download).

# Development

## Setup

### Requirements

- [NodeJS](https://nodejs.org) `lts/fermium` (Node 14.x)
- [Yarn 1.x](https://classic.yarnpkg.com/) (Classic)
- [Python](https://www.python.org/) 2.7 or 3.5+
- A C/C++ toolchain (see [node-gyp documentation](https://github.com/nodejs/node-gyp#on-unix))
- On Linux: ```sudo apt-get update && sudo apt-get install libudev-dev libusb-1.0-0-dev```

## Install

```bash
# install dependencies
yarn
```

## Run

```bash
# launch the app
yarn start
```

## Build

```bash
# Build & package the whole app
# Creates a .dmg for Mac, .exe installer for Windows, or .AppImage for Linux
# Output files will be created in dist/ folder
yarn dist
```

---

## Config (optional helpers)

### Environment variables

(you can use a .env or export environment variables)

```bash
NO_DEBUG_COMMANDS=1
NO_DEBUG_DB=1
NO_DEBUG_ACTION=1
NO_DEBUG_TAB_KEY=1
NO_DEBUG_NETWORK=1
NO_DEBUG_ANALYTICS=1
NO_DEBUG_WS=1
NO_DEBUG_DEVICE=1
NO_DEBUG_COUNTERVALUES=1
```

other envs can be seen in [live-common:src/env.js](https://github.com/LedgerHQ/ledger-live-common/blob/master/src/env.js)

### Run tests

In a terminal you need to have webpack dev server running
```bash
yarn start
```

In an other terminal you need to launch the webdriver/electron container. First run will be slow.
Next ones will be fast unless some changes are made to the container or package.json. You need to kill and re run the command if package.json changed. Make sure you are running Docker.
```bash
yarn start-electron-webdriver
```

You can point VNCViewer to `localhost::5900` to check what is happening in the container. `secret` is the password.
Then you can launch tests.
```bash
yarn spectron
```
or
```bash
node_modules/.bin/jest tests/specs/<FILEREGEX>.spec.js
```

By default it uses --runInBand jest option otherwise it explodes!

If you need to create an app.json, run a test that set up what you need and run it with the env var `SPECTRON_DUMP_APP_JSON` set. It will create `tests/dump.json` at the end of the spec.

**Please put the image expectations at the end of the it(...) tests so that it does not break the whole flow if a snapshot breaks**

### Run code quality checks

```bash
yarn ci
```

## File structure

```
src
├── main : the main process is the mother of all process. it boots internal and renderer process and starts the window.
├── internal : related to internal thread that runs commands, device logic, libcore,..
├── renderer : everything related to the UI.
│   ├── screens
│   ├── modals
│   ├── components : all components that are not screens or modals, flattened.
│   ├── animations
│   ├── icons
│   ├── images
│   ├── styles
│   ├── bridge : logic related to interacting with accounts and currencies.
│   ├── families : per currency specific logic and components
│   ├── actions : redux actions
│   ├── reducers : redux reducers
│   ├── middlewares
│   ├── analytics
│   ├── fonts
│   ├── hooks
│   ├── i18n : all translation files
│   ├── index.html : html point point
│   ├── index.js : js entry point
│   ├── init.js : initialize the rendering
│   ├── live-common-setup.js : set up live-common for renderer specific parts
│   └── ... other files related to renderer
├── config : constants files. DEPRECATED. will be moved to live-common.
├── helpers : helpers. DEPRECATED. will be moved to live-common or in relevant places.
├── live-common-set-supported-currencies.js : generic set up of supported coins
├── live-common-setup.js : generic set up of live-common
├── logger : internal logging library. used by all thread. produces the "export logs".
├── network.js : network implementation. will eventually move back to live-common.
└── sentry : related to bug report API
```

