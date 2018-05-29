// @flow
import type { Account, Operation, CryptoCurrencyConfig } from '@ledgerhq/live-common/lib/types'

type Explorer = Operation => ?string

const fallback = () => null

const txExplorers: CryptoCurrencyConfig<Explorer> = {
  bitcoin_cash: op => `https://bitcoincash.blockexplorer.com/tx/${op.hash}`,
  bitcoin_gold: op => `https://btgexplorer.com/tx/${op.hash}`,
  bitcoin_testnet: op => `https://testnet.blockchain.info/tx/${op.hash}`,
  bitcoin: op => `https://blockchain.info/tx/${op.hash}`,
  ethereum_testnet: op => `https://ropsten.etherscan.io/tx/${op.hash}`,
  ethereum: op => `https://etherscan.io/tx/${op.hash}`,
  ripple: op => `https://bithomp.com/explorer/${op.hash}`,
  zcash: op => `https://explorer.zcha.in/transactions/${op.hash}`,

  viacoin: fallback,
  vertcoin: fallback,
  stratis: fallback,
  stealthcoin: fallback,
  qtum: fallback,
  pivx: fallback,
  peercoin: fallback,
  komodo: fallback,
  hshare: fallback,
  dogecoin: fallback,
  digibyte: fallback,
  dash: fallback,
  zencash: fallback,
  litecoin: fallback,
  ethereum_classic: fallback,
}

export const getTxURL = (account: Account, operation: Operation): ?string =>
  txExplorers[account.currency.id](operation)
