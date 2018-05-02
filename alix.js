/* eslint-disable no-console */

const CommNodeHid = require('@ledgerhq/hw-transport-node-hid').default
const Btc = require('@ledgerhq/hw-app-btc').default

const { CREATE } = process.env

const {
  createWallet,
  createAccount,
  createAmount,
  getCurrency,
  getWallet,
  syncAccount,
  signTransaction,
} = require('ledger-core')

async function getOrCreateWallet(currencyId) {
  try {
    const wallet = await getWallet(currencyId)
    return wallet
  } catch (err) {
    const currency = await getCurrency(currencyId)
    const wallet = await createWallet(currencyId, currency)
    return wallet
  }
}

async function scanNextAccount(wallet, hwApp, accountIndex = 0) {
  console.log(`creating an account with index ${accountIndex}`)
  const account = await createAccount(wallet, hwApp)
  console.log(`synchronizing account ${accountIndex}`)
  await syncAccount(account)
  console.log(`finished sync`)
  const utxoCount = await account.asBitcoinLikeAccount().getUTXOCount()
  console.log(`utxoCount = ${utxoCount}`)
}

async function scanAccountsOnDevice(props) {
  try {
    const { devicePath, currencyId } = props
    console.log(`get or create wallet`)
    const wallet = await getOrCreateWallet(currencyId)
    console.log(`open device`)
    const transport = await CommNodeHid.open(devicePath)
    console.log(`create app`)
    const hwApp = new Btc(transport)
    console.log(`scan account`)
    const accounts = await scanNextAccount(wallet, hwApp)
    console.log(accounts)
    return []
  } catch (err) {
    console.log(err)
  }
}

waitForDevices(async device => {
  // const accounts = await scanAccountsOnDevice({
  //   devicePath: device.path,
  //   currencyId: 'bitcoin_testnet',
  // })
  // console.log(accounts)
  try {
    console.log(`> Creating transport`)
    const transport = await CommNodeHid.open(device.path)

    // transport.setDebugMode(true)

    console.log(`> Instanciate BTC app`)
    const hwApp = new Btc(transport)

    console.log(`> Get currency`)
    const currency = await getCurrency('bitcoin_testnet')

    console.log(`> Create wallet`)
    const wallet = CREATE ? await createWallet('khalil', currency) : await getWallet('khalil')

    console.log(`> Create account`)
    const account = CREATE ? await createAccount(wallet, hwApp) : await wallet.getAccount(0)

    console.log(`> Sync account`)
    if (true || CREATE) {
      await syncAccount(account)
    }

    console.log(`> Create transaction`)
    const transaction = await createTransaction(wallet, account)
    const signedTransaction = await signTransaction(hwApp, transaction)

    await account.asBitcoinLikeAccount().broadcastRawTransaction(signedTransaction)
    // console.log(signedTransaction);

    process.exit(0)
    // console.log(account.getIndex());
    // console.log(account.isSynchronizing());
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
})

function waitForDevices(onDevice) {
  console.log(`> Waiting for device...`)
  CommNodeHid.listen({
    error: () => {},
    complete: () => {},
    next: async e => {
      if (!e.device) {
        return
      }
      if (e.type === 'add') {
        console.log(`> Detected ${e.device.manufacturer} ${e.device.product}`)
        onDevice(e.device)
      }
      if (e.type === 'remove') {
        console.log(`removed ${JSON.stringify(e)}`)
      }
    },
  })
}

async function createTransaction(wallet, account) {
  const ADDRESS_TO_SEND = 'n2jdejywRogCunR2ozZAfXp1jMnfGpGXGR'

  const bitcoinLikeAccount = account.asBitcoinLikeAccount()
  const walletCurrency = wallet.getCurrency()
  const amount = createAmount(walletCurrency, 10000)
  const fees = createAmount(walletCurrency, 1000)

  const transactionBuilder = bitcoinLikeAccount.buildTransaction()
  transactionBuilder.sendToAddress(amount, ADDRESS_TO_SEND)
  // TODO: don't use hardcoded value for sequence (and first also maybe)
  transactionBuilder.pickInputs(0, 0xffffff)
  transactionBuilder.setFeesPerByte(fees)

  return transactionBuilder.build()
}
