# Ledger Wallet Desktop

## Requirements

* nodejs v8.x (https://nodejs.org/en/)
* yarn latest (https://yarnpkg.com/fr/docs/install)

## Setup

#### Create .env file and complete it, if you want main & renderer errors to be tracked

```
SENTRY_URL=http://...
DEV_TOOLS_MODE=right|bottom|undocked|detach
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

> Package everything

```
yarn dist
```

## Release

```
yarn release
```
