// @flow
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { BigNumber } from 'bignumber.js'
import { createCustomErrorClass } from 'helpers/errors'
import network from './network'
import { blockchainBaseURL } from './Ledger'

export const LedgerAPINotAvailable = createCustomErrorClass('LedgerAPINotAvailable')

export type Block = { height: number } // TODO more fields actually
export type Tx = {
  hash: string,
  received_at: string,
  nonce: string,
  value: number,
  gas: number,
  gas_price: number,
  cumulative_gas_used: number,
  gas_used: number,
  from: string,
  to: string,
  input: string,
  index: number,
  block?: {
    hash: string,
    height: number,
    time: string,
  },
  confirmations: number,
}

export type API = {
  getTransactions: (
    address: string,
    blockHash: ?string,
  ) => Promise<{
    truncated: boolean,
    txs: Tx[],
  }>,
  getCurrentBlock: () => Promise<Block>,
  getAccountNonce: (address: string) => Promise<number>,
  broadcastTransaction: (signedTransaction: string) => Promise<string>,
  getAccountBalance: (address: string) => Promise<BigNumber>,
}

export const apiForCurrency = (currency: CryptoCurrency): API => {
  const baseURL = blockchainBaseURL(currency)
  if (!baseURL) {
    throw new LedgerAPINotAvailable(`LedgerAPINotAvailable ${currency.id}`, {
      currencyName: currency.name,
    })
  }
  return {
    async getTransactions(address, blockHash) {
      const { data } = await network({
        method: 'GET',
        url: `${baseURL}/addresses/${address}/transactions`,
        params: { blockHash, noToken: 1 },
      })
      return data
    },
    async getCurrentBlock() {
      const { data } = await network({
        method: 'GET',
        url: `${baseURL}/blocks/current`,
      })
      return data
    },
    async getAccountNonce(address) {
      const { data } = await network({
        method: 'GET',
        url: `${baseURL}/addresses/${address}/nonce`,
      })
      return data[0].nonce
    },
    async broadcastTransaction(tx) {
      const { data } = await network({
        method: 'POST',
        url: `${baseURL}/transactions/send`,
        data: { tx },
      })
      return data.result
    },
    async getAccountBalance(address) {
      const { data } = await network({
        method: 'GET',
        url: `${baseURL}/addresses/${address}/balance`,
      })
      // FIXME precision lost here. nothing we can do easily
      return BigNumber(data[0].balance)
    },
  }
}
