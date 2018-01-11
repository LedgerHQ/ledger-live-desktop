const path = require('path')
const fs = require('fs')

function folderExists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK | fs.constants.W_OK) // eslint-disable-line no-bitwise
    return true
  } catch (err) {
    return false
  }
}

try {
  const DEST_FOLDER = path.resolve(__dirname, '../static')
  const USB_FILE = path.resolve(__dirname, '../dist/main/usb.js')
  const DEST_USB_FILE = path.join(DEST_FOLDER, 'usb.js')
  if (!folderExists(DEST_FOLDER)) {
    fs.mkdirSync(DEST_FOLDER)
  }
  const stream = fs.createReadStream(USB_FILE).pipe(fs.createWriteStream(DEST_USB_FILE))
  stream.on('error', err => {
    throw err
  })
} catch (err) {
  console.log(`x Something went wrong`, err)
}
