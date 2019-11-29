/* eslint-disable no-console */

const WORDINGS = require('../static/i18n/en/app.json')
const ERRORS = require('@ledgerhq/errors')

const blacklist = [
  "Error",
  "CustomError",
  "BluetoothRequired",
  "TransportWebUSBGestureRequired",
  "LedgerAPIError",
  "LedgerAPIErrorMessage",
  "generic",
  "TimeoutError"
]

async function main() {
  console.log(`>> Checking for errors that lack wordings...`)

  const errorNames = Object.keys(ERRORS).reduce((acc, error) => {
    const Error = ERRORS[error]
    if (typeof Error === 'function') {
      const t = new Error('test')
      if (t.name && !blacklist.includes(t.name)) {
        acc.push(t.name)
      }
    }
    return acc
  }, [])

  const errorWordings = WORDINGS.errors
  let incomplete = false

  errorNames.forEach(errorName => {
    const errorWording = errorWordings[errorName]
    if (!errorWording) {
      console.log(`-- No wordings found for error [${errorName}]`)
      incomplete = true
      return
    }

    if (!errorWording.title) {
      console.log(`-- Missing title for error [${errorName}]`)
      incomplete = true
    }
  })

  console.log(`>> Checking for zombie error wordings...`)

  Object.keys(errorWordings).forEach(errorWordingName => {
    if (!errorNames.includes(errorWordingName) && !blacklist.includes(errorWordingName)) {
      console.log(`-- No error [${errorWordingName}] (but found in wordings)`)
      incomplete = true
    }
  })



  if (incomplete) {
    console.error('some defined errors are lacking wordings. Please define wordings.')
    process.exit(-1)
  }
}

main()
