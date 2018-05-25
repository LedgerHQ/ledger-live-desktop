// @flow
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'

const txExplorers: { [_: string]: (Operation) => string } = {
  bitcoin_cash: op => `https://bitcoincash.blockexplorer.com/tx/${op.hash}`,
  bitcoin_gold: op => `https://btgexplorer.com/tx/${op.hash}`,
  bitcoin_testnet: op => `https://testnet.blockchain.info/tx/${op.hash}`,
  bitcoin: op => `https://blockchain.info/tx/${op.hash}`,
  ethereum_testnet: op => `https://ropsten.etherscan.io/tx/${op.hash}`,
  ethereum: op => `https://etherscan.io/tx/${op.hash}`,
  ripple: op => `https://bithomp.com/explorer/${op.hash}`,
  zcash: op => `https://explorer.zcha.in/transactions/${op.hash}`,
}

export const getTxURL = (account: Account, operation: Operation): ?string => {
  const f = txExplorers[account.currency.id]
  return f ? f(operation) : null
}
