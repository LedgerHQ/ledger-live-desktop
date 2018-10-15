/* eslint-disable no-console */

import '@babel/polyfill'
import 'globals'
import withLibcore from 'helpers/withLibcore'

import { scanAccountsOnDevice } from 'helpers/libcore'
import getDevice from './getDevice'

async function main() {
  try {
    const device = await getDevice()

    await withLibcore(async core => {
      const accounts = await scanAccountsOnDevice({
        core,
        devicePath: device.path,
        currencyId: 'ethereum',
        onAccountScanned: account => {
          console.log(`---------------------> account scanned: ${account.id}`)
        },
        isUnsubscribed: () => false,
      })
      // console.log(`\n-- final result --\n`)
       console.log(accounts)
    })
  } catch (err) {
    console.log(`[ERROR]`, err)
  }
}

main()
