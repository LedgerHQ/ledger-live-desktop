# ledgerLive-QA
Automated tests for Ledger Live Desktop application.  
Start Ledger Live Desktop application with accounts for the supported coin. Operations history removed from db. Then sync to retrieve account balance and transactions history.


## Accounts setup and sync
#### Launch test
yarn test-sync

#### Test description
Clean Ledger Live Application settings directory.  
Copy app.json init file for testing in a new Ledger Live Application settings directory.  
Start Ledger Live Desktop app.  
Wait for sync OK.  
Compare new app.json with expected app.json file.
