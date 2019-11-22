/* eslint-disable no-console */

const WORDINGS = require('../static/i18n/en/app.json')
const ERRORS = require('@ledgerhq/errors')

async function main() {
  console.log(`>> Checking for errors that lack wordings...`)

  const errorNames = Object.keys(ERRORS).map(error => {
  const Error = ERRORS[error]
    if (typeof Error === 'function') {
      const t = new Error('test')
      return t.name
    }
  }).filter(error => error !== undefined)

  const errorWordings = WORDINGS.errors
  let incomplete = false

  errorNames.forEach(errorName => {
    const errorWording = errorWordings[errorName]
    if (!errorWording) {
      console.log(`missing wordings for error [${errorName}]`)
      incomplete = true
      return
    }

    if (!errorWording.title) {
      console.log(`missing title for error [${errorName}]`)
      incomplete = true
    }
  })

  console.log(`>> Checking for zombie error wordings...`)

  Object.keys(errorWordings).forEach(errorWordingName => {
    if (!errorNames.includes(errorWordingName)) {
      console.log(`No error called [${errorWordingName}] (found in wordings)`)
      incomplete = true
    }
  })



  if (incomplete) {
    console.error('some defined errors are lacking wordings. Please define wordings.')
    process.exit(-1)
  }
}

main()
