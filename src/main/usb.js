process.title = 'ledger-wallet-desktop-usb'

const HID = require('ledger-node-js-hid')
const objectPath = require('object-path')
const { isLedgerDevice } = require('ledgerco/lib/utils')
const ledgerco = require('ledgerco')

function send(type, data, options = { kill: true }) {
  process.send([type, data, options])
}

async function getWalletInfos(path, wallet) {
  if (wallet === 'btc') {
    const comm = new ledgerco.comm_node(new HID.HID(path), true, 0, false)
    const btc = new ledgerco.btc(comm)
    const walletInfos = await btc.getWalletPublicKey_async("44'/0'/0'/0")
    return walletInfos
  }
  throw new Error('invalid wallet')
}

let isListenDevices = false

const handlers = {
  devices: {
    listen: () => {
      if (isListenDevices) {
        return
      }

      isListenDevices = true

      const handleChangeDevice = (device, event) =>
        isLedgerDevice(device) && send(event, device, { kill: false })

      HID.listenDevices.start()

      HID.listenDevices.events.on('add', handleChangeDevice)
      HID.listenDevices.events.on('remove', handleChangeDevice)
    },
    all: () => send('devices.update', HID.devices().filter(isLedgerDevice)),
  },
  wallet: {
    infos: {
      request: async ({ path, wallet }) => {
        try {
          const publicKey = await getWalletInfos(path, wallet)
          send('wallet.infos.success', { path, publicKey })
        } catch (err) {
          send('wallet.infos.fail', { path, err: err.stack || err })
        }
      },
    },
  },
}

process.on('message', payload => {
  const [type, data] = payload

  const handler = objectPath.get(handlers, type)
  if (!handler) {
    return
  }

  handler(data)
})
