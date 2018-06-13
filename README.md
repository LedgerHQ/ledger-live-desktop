# Ledger Live - Desktop

[![CircleCI](https://circleci.com/gh/LedgerHQ/ledger-live-desktop.svg?style=svg)](https://circleci.com/gh/LedgerHQ/ledger-live-desktop)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/ledger-wallet/localized.svg)](https://crowdin.com/project/ledger-wallet)

:warning: Disclaimer: this project is under active development. Use at your own risks.

## Installation

#### Requirements

Project has been tested with

- [NodeJS](https://nodejs.org) v9.3.0
- [Yarn](https://yarnpkg.com) v1.3.0
- [Python](https://www.python.org/) v2.7.10 (used by [node-gyp](https://github.com/nodejs/node-gyp) to build native addons)
- You will also need a C++ compiler

#### Optional

- `Museo Sans` font - for Ledger guys, [follow that link](https://drive.google.com/drive/folders/14R6kGFtx53DuqTyIOjnT7BGogzeyMSzN), download `museosans.zip` and extract it inside the `static/fonts/museosans` directory

#### Setup

1.  Install dependencies

```bash
yarn
```

2.  Create `.env` file

```bash
# ENV VARIABLES
# -------------

# Where errors will be tracked (you may not want to edit this line)
# SENTRY_URL=

# OPTIONAL ENV VARIABLES
# ----------------------

# API base url, fallback to our API if not set
API_BASE_URL=http://...

# Setup device debug mode
DEBUG_DEVICE=0

# Developer tools position (used only in dev)
# can be one of: right, bottom, undocked, detach
DEV_TOOLS_MODE=bottom

# Filter debug output
DEBUG=lwd*,-lwd:syncb

# hide the dev window
HIDE_DEV_WINDOW=0
```

#### Development commands

```bash
# Launch the app
yarn start

# Launch the storybook
yarn storybook

# Code quality checks
yarn lint                # launch eslint
yarn prettier            # launch prettier
yarn flow                # launch flow
yarn test                # launch unit tests
```

#### Building from source

```bash
# Build & package the whole app
# Creates a .dmg for Mac, .exe installer for Windows, or .AppImage for Linux
# Output files will be created in dist/ folder
yarn dist
```

**Note:** Use `yarn dist:dir` to speed up the process: it will skip the packaging step. Handy for debugging builds. You can also use `BUNDLE_ANALYZER=1 yarn dist:dir` to generate [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) report.
