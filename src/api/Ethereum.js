// @flow
import axios from 'axios'
import { retry } from 'helpers/promise'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { blockchainBaseURL, userFriendlyError } from './Ledger'

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
  getAccountBalance: (address: string) => Promise<number>,
}

export const apiForCurrency = (currency: CryptoCurrency): API => {
  const baseURL = blockchainBaseURL(currency)

  return {
    async getTransactions(address, blockHash) {
      const { data } = await userFriendlyError(
        retry(
          () =>
            axios.get(`${baseURL}/addresses/${address}/transactions`, {
              params: { blockHash, noToken: 1 },
            }),
          { maxRetry: 3 },
        ),
      )
      return data
    },
    async getCurrentBlock() {
      const { data } = await userFriendlyError(
        retry(() => axios.get(`${baseURL}/blocks/current`), { maxRetry: 3 }),
      )
      return data
    },
    async getAccountNonce(address) {
      const { data } = await userFriendlyError(
        retry(() => axios.get(`${baseURL}/addresses/${address}/nonce`), { maxRetry: 3 }),
      )
      return data[0].nonce
    },
    async broadcastTransaction(tx) {
      const { data } = await userFriendlyError(axios.post(`${baseURL}/transactions/send`, { tx }))
      return data.result
    },
    async getAccountBalance(address) {
      const { data } = await userFriendlyError(
        retry(() => axios.get(`${baseURL}/addresses/${address}/balance`), { maxRetry: 3 }),
      )
      return data[0].balance
    },
  }
}
