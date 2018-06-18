# Ledger Live - Desktop

[![CircleCI](https://circleci.com/gh/LedgerHQ/ledger-live-desktop.svg?style=svg)](https://circleci.com/gh/LedgerHQ/ledger-live-desktop)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/ledger-wallet/localized.svg)](https://crowdin.com/project/ledger-wallet)

:warning: Disclaimer: this project is under active development. Use at your own risks.

<img src="/static/docs/images/ledgerLogo.png" width="200"/>

> Ledger Live Desktop is a new generation Ledger Wallet application build with React, Redux and Electron to run natively on the web. The main goal of the app is to provide our users with a single wallet for all crypto currencies supported by our devices. To learn more check out [Ledger](https://www.ledgerwallet.com/?utm_source=redirection&utm_medium=variable)

## Architecture

From one side Ledger Desktop app connected to the Blockchain via the in-house written C++ library - LibCore and from the other it communicates to the Ledger Hardware Device to securely sign all transactions.

<p align="center">
 <img src="/static/docs/images/architecture.jpg" width="550" heigth="300"/>
</p>

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

### Create a .env file

```bash
SENTRY_URL=...        # Edit this line if you want to send errors to your sentry account

API_BASE_URL=http://...      # API base url, fallback to our API if not set

DEBUG_DEVICE=0       # Setup device debug mode

DEV_TOOLS_MODE=bottom     # Developer tools position (used only in dev). Options: right, bottom, undocked, detach

DEBUG=lwd*,-lwd:syncb  # Filter debug output

HIDE_DEV_WINDOW=0    # hide the dev window

SKIP_ONBOARDING=1    # To skip the onboarding
```

### Launch storybook

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

### Programmaically reset hard the app

Stop the app and to clean accounts, settings, etc, run

```bash
rm -rf ~/Library/Application\ Support/Electron/
```

## Additional Info on tools used in the app

- Sentry - error-tracking software, [learn more](https://sentry.io/welcome/)
- Storybook - UI development environment, [learn more](https://storybook.js.org/)
- U2F - We use a custom transport encapsulation to pass instructions to the hardware device with U2F protocol. [Learn more about U2F](https://en.wikipedia.org/wiki/Universal_2nd_Factor)
