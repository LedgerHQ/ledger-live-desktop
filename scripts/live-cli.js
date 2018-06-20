//                         This is a work in progress
//             The goal is to provide a cli which allow interact
//                with device & libcore for faster iterations

require('babel-polyfill')
require('babel-register')

const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')
const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default

const { serializeAccounts, encodeAccount, decodeAccount } = require('../src/reducers/accounts')
const { doSignAndBroadcast } = require('../src/commands/libcoreSignAndBroadcast')

const coreHelper = require('../src/helpers/libcore')
const withLibcore = require('../src/helpers/withLibcore').default

if (!process.env.LEDGER_LIVE_SQLITE_PATH) {
  throw new Error('you must define process.env.LEDGER_LIVE_SQLITE_PATH first')
}

const LOCAL_DIRECTORY_PATH = path.resolve(process.env.LEDGER_LIVE_SQLITE_PATH, '../')

gimmeDeviceAndLibCore(async ({ device, core, njsWalletPool }) => {
  const raw = require(path.join(LOCAL_DIRECTORY_PATH, 'accounts.json')) // eslint-disable-line import/no-dynamic-require
  const accounts = serializeAccounts(raw.data)
  const accountToUse = await chooseAccount('Which account to use?', accounts)
  await actionLoop({ account: accountToUse, accounts, core, njsWalletPool, device })
  process.exit(0)
})

async function actionLoop(props) {
  try {
    const { account, accounts, core, njsWalletPool, device } = props
    const actionToDo = await chooseAction(`What do you want to do with [${account.name}] ?`)
    if (actionToDo === 'send funds') {
      const transport = await TransportNodeHid.open(device.path)
      const accountToReceive = await chooseAccount('To which account?', accounts)
      const receiveAddress = await getFreshAddress({
        account: accountToReceive,
        core,
        njsWalletPool,
      })
      console.log(`the receive address is ${receiveAddress}`)
      const rawAccount = encodeAccount(account)
      console.log(`trying to sign and broadcast...`)
      const rawOp = await doSignAndBroadcast({
        account: rawAccount,
        transaction: {
          amount: 4200000,
          recipient: receiveAddress,
          feePerByte: 16,
          isRBF: false,
        },
        deviceId: device.path,
        core,
        transport,
      })
      console.log(rawOp)
    } else if (actionToDo === 'sync') {
      console.log(`\nLaunch sync...\n`)
      const rawAccount = encodeAccount(account)
      const syncedAccount = await coreHelper.syncAccount({ rawAccount, core, njsWalletPool })
      console.log(`\nEnd sync...\n`)
      console.log(`updated account: `, displayAccount(syncedAccount, 'red'))
    } else if (actionToDo === 'quit') {
      return true
    }
  } catch (err) {
    console.log(`x Something went wrong`)
    console.log(err)
    process.exit(1)
  }
  return actionLoop(props)
}

async function chooseInList(msg, list, formatItem = i => i) {
  const choices = list.map(formatItem)
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: msg,
      choices,
    },
  ])
  const index = choices.indexOf(choice)
  return list[index]
}

async function chooseAction(msg) {
  return chooseInList(msg, ['sync', 'send funds', 'quit'])
}

function chooseAccount(msg, accounts) {
  return chooseInList(msg, accounts, acc => displayAccount(acc))
}

async function gimmeDeviceAndLibCore(cb) {
  withLibcore((core, njsWalletPool) => {
    TransportNodeHid.listen({
      error: () => {},
      complete: () => {},
      next: async e => {
        if (!e.device) {
          return
        }
        if (e.type === 'add') {
          const { device } = e
          cb({ device, core, njsWalletPool })
        }
      },
    })
  })
}

function displayAccount(acc, color = null) {
  const isRawAccount = typeof acc.lastSyncDate === 'string'
  if (isRawAccount) {
    acc = decodeAccount(acc)
  }
  const str = `[${acc.name}] ${acc.isSegwit ? '' : '(legacy) '}${acc.unit.code} ${acc.balance} - ${
    acc.operations.length
  } txs`
  return color ? chalk[color](str) : str
}

async function getFreshAddress({ account, core, njsWalletPool }) {
  const njsAccount = await coreHelper.getNJSAccount({ account, njsWalletPool })
  const unsub = await core.syncAccount(njsAccount)
  unsub()
  const rawAddresses = await njsAccount.getFreshPublicAddresses()
  return rawAddresses[0]
}
