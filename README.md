# Ledger Live - Desktop

[![CircleCI](https://circleci.com/gh/LedgerHQ/ledger-live-desktop.svg?style=svg)](https://circleci.com/gh/LedgerHQ/ledger-live-desktop)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/ledger-wallet/localized.svg)](https://crowdin.com/project/ledger-wallet)

:warning: Disclaimer: this project is under active development. Use at your own risks.

## Installation

#### Requirements

Project has been tested under [NodeJS](https://nodejs.org) v9.3.0, with [Yarn](https://yarnpkg.com) v1.3.0 and [Python](https://www.python.org/) v2.7.10 (used by [node-gyp](https://github.com/nodejs/node-gyp) to build native addons). You will also need a C++ compiler.

#### Setup

1.  Install dependencies

```bash
yarn
```

2.  Create `.env` file

```bash
# ENV VARIABLES
# -------------

# Where errors will be tracked
SENTRY_URL=http://...

# OPTIONAL ENV VARIABLES
# ----------------------

# Developer tools position (used only in dev)
# can be one of: right, bottom, undocked, detach
DEV_TOOLS_MODE=bottom

# Filter debug output
DEBUG=lwd*,-lwd:syncb
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

## License

```
The MIT License

Copyright (c) 2017-present Ledger https://www.ledgerwallet.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
