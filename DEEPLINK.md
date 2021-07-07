# Deep Linking Ledger Live

## Protocols

Currently, Ledger Live will open with this scheme:

- ledgerlive://

## Routing

_Every route is preceded by the protocol \*\*\_ledgerlive://_\*\*\_

- **_portfolio_** 🠒 Portfolio page (default landing)

  `ledgerlive://` _or_ `ledgerlive://portfolio`

- **_accounts_** 🠒 Accounts Page

  `ledgerlive://accounts` will redirect to accounts page

- **_account?currency_** 🠒 Account Page

  `ledgerlive://account?currency=btc` will open first bitcoin account found

  - _currency_ => the ticker or name of the currency **required**

- **_send?currency?amount?recipient_** 🠒 Send Flow

  `ledgerlive://send` will redirect to send page

      	`ledgerlive://send?currency=ethereum` will redirect to send page with the first ethereum account found

  `ledgerlive://send?currency=ethereum&recipient=0xex...xxx&amount=3` will redirect to send page with the first ethereum account found and recipient and amount prefilled

      	- *currency* => the ticker of the currency **required**
      	- *amount* => the amount to send
      	- *recipient* => the address to send to

- **_receive?currency_** 🠒 Receive Flow

  `ledgerlive://receive?currency=ethereum` will redirect to receive page with the first ethereum account found

      	- *currency* => the ticker or name of the currency **required**

- **delegate?currency\_** 🠒 Send Flow

      	`ledgerlive://delegate?currency=tron` will redirect to delegation page with the first tron account found

      	- *currency* => the ticker or name of the currency **required**
      	- *validators* => TBD - no ready yet

* **\_buy** 🠒 Buy Crypto Flow

  `ledgerlive://buy` will redirect to buy page

* **_swap_** 🠒 Swap Crypto Flow

  `ledgerlive://swap` will redirect to swap page
