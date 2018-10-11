#!/bin/bash

# TODO: os specific
export LEDGER_DATA_DIR="$HOME/.config/Electron"
export LEDGER_LOGS_DIRECTORY="$LEDGER_DATA_DIR/logs"
export LEDGER_LIVE_SQLITE_PATH="$LEDGER_DATA_DIR/sqlite"
export CLI=1

node -r @babel/register scripts/cli/txBetweenAccounts.js
