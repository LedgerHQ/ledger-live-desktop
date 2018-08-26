## Temptative track of what's done and what's to be done
>If someone else gets involved in this we can do things more organised, if not then I'm happy in my mess.

### List of things that are working
  - Detecting accounts from the device with funds, through derivative paths too
  - Adding accounts, renaming, deleting, etc
  - Live updates and pretty charts
  - Signing SIMPLE transactions, mainly just a single payment without a memo
  - Working with a locally created account derived from our seed that is not created yet
  - Detect that we are sending XLM to a non existing account (but valid) in order to change
    the operation from a payment to a create_account one. With minimum startingBalance check
  - Synchronisation of accounts which updates balances and operations
  - UI for memos
  - Memos and memo types, with validations

### What can be done
  - Displaying the memo of an existing transaction, maybe on the detail view until we get tags on ledger live
  - Filtering out transactions that are lower than X amount, due to spam 
  - You tell me

### How to set-up the environment to work or _what are those hoops I need to jump through_
This section used to be a very long and problematic list of things that needed to be done in order
to get your local version of this working. However, since then, the dependencies have been updated
to support Stellar. In particular, my pull request for ledger-common was accepted and
the versions used by `live-desktop` and `ledger-api-countervalue` have been updated to use that version.

You just need to clone this repo and run `yarn start` in order to launch a version that supports XLM.
I strongly advice you not to do this unless you are comfortable, take your time to go through the code
if you have any knowledge and feel free to point any mistakes you may find there or in using it.

If you don't feel comfortable using this until it's officially merged (you are a wise person) you can set
and environment variable in a file called `.env` in the root of your project and add `STELLAR_USE_TESTNET=1` in order
to use the test net, then you can add t`est funds to it in the laboratory. 