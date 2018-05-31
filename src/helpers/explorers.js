// @flow
import type { Account, Operation, CryptoCurrencyConfig } from '@ledgerhq/live-common/lib/types'

type Explorer = Operation => ?string

const txExplorers: CryptoCurrencyConfig<Explorer> = {
  bitcoin_cash: op => `https://bitcoincash.blockexplorer.com/tx/${op.hash}`,
  bitcoin_gold: op => `https://btgexplorer.com/tx/${op.hash}`,
  bitcoin_testnet: op => `https://testnet.blockchain.info/tx/${op.hash}`,
  bitcoin: op => `https://blockchain.info/tx/${op.hash}`,
  dash: op => `https://explorer.dash.org/tx/${op.hash}`,
  digibyte: op => `https://digiexplorer.info/tx/${op.hash}`,
  dogecoin: op => `https://dogechain.info/tx/${op.hash}`,
  ethereum_classic: op => `https://gastracker.io/tx/${op.hash}`,
  ethereum_testnet: op => `https://ropsten.etherscan.io/tx/${op.hash}`,
  ethereum: op => `https://etherscan.io/tx/${op.hash}`,
  hcash: op => `http://explorer.h.cash/tx/${op.hash}`,
  komodo: op => `https://kmd.explorer.supernet.org/tx/${op.hash}`,
  litecoin: op => `http://explorer.litecoin.net/tx/${op.hash}`,
  peercoin: op => `https://explorer.peercoin.net/tx/${op.hash}`,
  pivx: () => null, // FIXME can't find a reliable/official explorer
  poswallet: () => null, // FIXME can't find a reliable/official explorer
  qtum: op => `https://explorer.qtum.org/tx/${op.hash}`,
  ripple: op => `https://bithomp.com/explorer/${op.hash}`,
  stealthcoin: () => null, // FIXME can't find a reliable/official explorer
  stratis: () => null, // FIXME can't find a reliable/official explorer
  vertcoin: op => `http://explorer.vertcoin.info/tx/${op.hash}`,
  viacoin: op => `https://explorer.viacoin.org/tx/${op.hash}`,
  zcash: op => `https://explorer.zcha.in/transactions/${op.hash}`,
  zencash: op => `https://explorer.zensystem.io/tx/${op.hash}`,
}

export const getTxURL = (account: Account, operation: Operation): ?string =>
  txExplorers[account.currency.id](operation)
