// @flow

//                          Scan accounts on device
//                          -----------------------
//
//                                _   ,--()
//                               ( )-'-.------|>
//                                "     `--[]
//

import ledgercore from 'ledger-core'

import type { Account } from '@ledgerhq/wallet-common/lib/types'

type Props = {
  devicePath: string,
  currencyId: string,
}

async function getOrCreateWallet() {
  // const wallet = awat
}

export default function scanAccountsOnDevice(props: Props): Account[] {
  const { devicePath, currencyId } = props
  console.log(ledgercore)
  console.log(`[[[[scanning accounts on device]]]] ${devicePath} ${currencyId}`)
  console.log(props)
  return []
}
