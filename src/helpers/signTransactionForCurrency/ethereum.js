// @flow
import invariant from 'invariant'
import Eth from '@ledgerhq/hw-app-eth'
import type Transport from '@ledgerhq/hw-transport'
import EthereumTx from 'ethereumjs-tx'

// see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
function getNetworkId(currencyId: string): ?number {
  switch (currencyId) {
    case 'ethereum':
      return 1
    case 'ethereum_classic':
      return 61
    case 'ethereum_classic_testnet':
      return 62
    case 'ethereum_testnet':
      return 3 // Ropsten by convention
    default:
      return null
  }
}

export default async (
  transport: Transport<*>,
  currencyId: string,
  path: string,
  t: {
    nonce: string,
    recipient: string,
    // these are in hexa string format (e.g. '0xABCDEF')
    gasPrice: string,
    gasLimit: string,
    amount: string,
  },
) => {
  // First, we need to create a partial tx and send to the device

  const chainId = getNetworkId(currencyId)
  invariant(chainId, `chainId not found for currency=${currencyId}`)
  const tx = new EthereumTx({
    nonce: t.nonce,
    gasPrice: t.gasPrice,
    gasLimit: t.gasLimit,
    to: t.recipient,
    value: t.amount,
    chainId,
  })
  tx.raw[6] = Buffer.from([chainId]) // v
  tx.raw[7] = Buffer.from([]) // r
  tx.raw[8] = Buffer.from([]) // s

  const eth = new Eth(transport)
  const result = await eth.signTransaction(path, tx.serialize().toString('hex'))

  // Second, we re-set some tx fields from the device signature

  tx.v = Buffer.from(result.v, 'hex')
  tx.r = Buffer.from(result.r, 'hex')
  tx.s = Buffer.from(result.s, 'hex')
  const signedChainId = Math.floor((tx.v[0] - 35) / 2) // EIP155: v should be chain_id * 2 + {35, 36}
  const validChainId = chainId & 0xff // eslint-disable-line no-bitwise
  invariant(
    signedChainId === validChainId,
    `Invalid chainId signature returned. Expected: ${chainId}, Got: ${signedChainId}`,
  )

  // Finally, we can send the transaction string to broadcast
  return `0x${tx.serialize().toString('hex')}`
}
