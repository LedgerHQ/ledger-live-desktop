const CommNodeHid = require('@ledgerhq/hw-transport-node-hid').default
const Btc = require('@ledgerhq/hw-app-btc').default

const CREATE_ACCOUNT = false

const {
  createWallet,
  createAccount,
  createAmount,
  getCurrency,
  getWallet,
  syncAccount,
  signTransaction,
  EVENT_CODE,
} = require('ledger-core')

waitForDevices(async device => {
  try {
    console.log(`> Creating transport`)
    const transport = await CommNodeHid.open(device.path)

    // transport.setDebugMode(true)

    console.log(`> Instanciate BTC app`)
    const hwApp = new Btc(transport)

    console.log(`> Get currency`)
    const currency = await getCurrency('bitcoin_testnet')

    console.log(`> Create wallet`)
    const wallet = CREATE_ACCOUNT
      ? await createWallet('khalil', currency)
      : await getWallet('khalil')

    console.log(`> Create account`)
    const account = CREATE_ACCOUNT ? await createAccount(wallet, hwApp) : await wallet.getAccount(0)

    console.log(`> Sync account`)
    if (true || CREATE_ACCOUNT) {
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
  const ADDRESS_TO_SEND = 'mqg5p9otMX9davdpNATcxjpKsPnopPtNvL'

  const bitcoinLikeAccount = account.asBitcoinLikeAccount()
  const walletCurrency = wallet.getCurrency()
  const amount = createAmount(walletCurrency, 109806740)
  const fees = createAmount(walletCurrency, 10)

  const transactionBuilder = bitcoinLikeAccount.buildTransaction()
  transactionBuilder.sendToAddress(amount, ADDRESS_TO_SEND)
  // TODO: don't use hardcoded value for sequence (and first also maybe)
  transactionBuilder.pickInputs(0, 0xffffff)
  transactionBuilder.setFeesPerByte(fees)

  return transactionBuilder.build()
}
