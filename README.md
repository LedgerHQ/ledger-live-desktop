# Ledger Wallet Desktop

[![CircleCI](https://circleci.com/gh/LedgerHQ/ledger-wallet-desktop.svg?style=svg)](https://circleci.com/gh/LedgerHQ/ledger-wallet-desktop)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/ledger-wallet/localized.svg)](https://crowdin.com/project/ledger-wallet)

:warning: Disclaimer: this project is under active development. Use at your own risks.

## Requirements

* nodejs v9.x (https://nodejs.org/en/)
* yarn latest (https://yarnpkg.com/fr/docs/install)

## Setup

#### Create .env file and complete it, if you want main & renderer errors to be tracked

```
SENTRY_URL=http://...
DEV_TOOLS_MODE=right|bottom|undocked|detach
DEBUG=lwd*,-lwd:sync
```

#### Install dependencies

```
yarn
```

## Development

```
yarn start
```

## Build

> Not package for distribution

```
yarn dist:dir
```

> Check bundle size

```
BUNDLE_ANALYZER=1 yarn dist:dir
```

> Package everything

```
yarn dist
```

## Release

```
yarn release
```
