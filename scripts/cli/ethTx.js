/* eslint-disable no-console */

import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'

import 'globals'
import accountModel from 'helpers/accountModel'
import { doSignAndBroadcast } from 'commands/libcoreSignAndBroadcast'
import withLibcore from 'helpers/withLibcore'
import parseAppFile from './parseAppFile'
import getDevice from './getDevice'

// { id: 'libcore:1:ethereum:0x9A7Dd4bA62C978744A45fF85356F3a600d8fB665:',
//     seedIdentifier: '0xA32C4b7968115742d55Ce2cB7Fd111d9A3cfc307',
//     derivationMode: '',
//     xpub: '0x9A7Dd4bA62C978744A45fF85356F3a600d8fB665',
//     path: '44\'/60\'',
//     name: 'Ethereum 1',
//     freshAddress: '0x9A7Dd4bA62C978744A45fF85356F3a600d8fB665',
//     freshAddressPath: '44\'/60\'/0\'/0/0',
//     balance: 3042995800000000,
//     blockHeight: 6531810,
//     archived: false,
//     index: 0,
//     operations: [],
//     pendingOperations: [],
//     currencyId: 'ethereum',
//     unitMagnitude: 18,
//     lastSyncDate: '2018-10-17T12:16:08.688Z' }

async function main() {
  try {
    const device = await getDevice()
    const app = await parseAppFile()
    const account = accountModel.decode(app.accounts[0])
    if (account.currency.id !== 'ethereum') {
      throw new Error('WTF dude your first account is not ethereum')
    }
    const currency = getCryptoCurrencyById('ethereum')

    await withLibcore(async core => {
      await doSignAndBroadcast({
        accountId: 'libcore:1:ethereum:0xAc6603e97e774Cd34603293b69bBBB1980acEeaA:',
        derivationMode: '',
        seedIdentifier: '0xfB98Bdd04d82648f25E67041D6E27a866BEC0B47',
        currency,
        xpub: '0xAc6603e97e774Cd34603293b69bBBB1980acEeaA',
        index: 0,
        transaction: {
          recipient: '0xAc6603e97e774Cd34603293b69bBBB1980acEeaA',
          amount: '1000000000000000',
          gasPrice: '8000000000',
          gasLimit: '21000',
        },
        deviceId: device.path,
        core,
        isCancelled: () => false,
        onSigned: () => {
          console.log(`[[[[transaction signed]]]]`)
        },
        onOperationBroadcasted: () => {
          console.log(`[[[[transaction broadcasted]]]]`)
        },
      })
    })
  } catch (err) {
    console.log(`[ERROR]`, err)
  }
}

main()
