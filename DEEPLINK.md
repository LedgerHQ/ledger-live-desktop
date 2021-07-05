# Deep Linking Ledger Live

## Protocols
Currently, Ledger Live will open with this scheme:
- ledgerlive://

## Routing
_Every route is preceded by the protocol_

- **portfolio** => `/`
- **accounts** => `/accounts`
- **account?currency=xxx** =>  `/account` of the selected currency with highest funds
	- *currency* => the ticker of the currency **required**
- **send?currency=xxx&arg2=xxx** => open `send` modal
	- *currency* => the ticker of the currency **required**
	- *amount* => the amount to send
	- *recipient* => the address to send to
- **receive?currency=xxx** => open the `receive` modal
	-  - *currency* => the ticker of the currency **required**
- **delegate?currency=xxx** => open the `delagation` flow
	- *currency* => the ticker of the currency **required**
	
	- *validator.s* => validator.s to delegate to _(not implemented yet)_
 

**### Examples**

`ledgerlive://portfolio` => to access the dashboard
`ledgerlive://account?currency=mana` => to access the first decentraland mana account  
`ledgerlive://send?currency=btc&amount=0.001&recipient=adress` => open the send modal with profiled inputs