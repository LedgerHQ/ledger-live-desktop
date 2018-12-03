/* eslint-disable no-console */

import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import { formatCurrencyUnit } from '@ledgerhq/live-common/lib/currencies'

import 'globals'
import withLibcore from 'helpers/withLibcore'
import accountModel from 'helpers/accountModel'
import { doSignAndBroadcast } from 'commands/libcoreSignAndBroadcast'

import getDevice from './getDevice'

async function main() {
  try {
    // GET ACCOUNTS
    const app = await parseAppFile()
    const accounts = app.accounts.map(accountModel.decode)

    // GET SENDER ACCOUNT
    const senderAccount = await chooseAccount(accounts, 'Choose sender account')

    // GET RECIPIENT ACCOUNT
    const recipientAccount = await chooseAccount(accounts, 'Choose recipient account')

    // GET AMOUNT & FEE
    const { amount, feePerByte } = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'Amount',
        default: 0,
      },
      {
        type: 'input',
        name: 'feePerByte',
        message: 'Fee per byte',
        default: 0,
      },
    ])

    // GET DEVICE
    console.log(chalk.blue(`Waiting for device...`))
    const device = await getDevice()
    console.log(chalk.blue(`Using device with path [${device.path}]`))

    await withLibcore(async core =>
      doSignAndBroadcast({
        accountId: senderAccount.id,
        currencyId: senderAccount.currency.id,
        xpub: senderAccount.xpub,
        freshAddress: senderAccount.freshAddress,
        freshAddressPath: senderAccount.freshAddressPath,
        index: senderAccount.index,
        transaction: {
          amount,
          feePerByte,
          recipient: recipientAccount.freshAddress,
        },
        deviceId: device.path,
        core,
        isCancelled: () => false,
        onSigned: () => {
          console.log(`>> signed`)
        },
        onOperationBroadcasted: operation => {
          console.log(`>> broadcasted`, operation)
        },
      }),
    )
  } catch (err) {
    console.log(`[ERROR]`, err)
  }
}

async function parseAppFile() {
  const appFilePath = path.resolve(process.env.LEDGER_DATA_DIR, 'app.json')
  const appFileContent = fs.readFileSync(appFilePath, 'utf-8')
  const parsedApp = JSON.parse(appFileContent)
  return parsedApp.data
}

async function chooseAccount(accounts, msg) {
  const { account } = await inquirer.prompt([
    {
      type: 'list',
      choices: accounts.map(account => ({
        name: `${account.name} | ${chalk.green(
          formatCurrencyUnit(account.unit, account.balance, {
            showCode: true,
          }),
        )}`,
        value: account,
      })),
      name: 'account',
      message: msg,
    },
  ])
  return account
}

main()
