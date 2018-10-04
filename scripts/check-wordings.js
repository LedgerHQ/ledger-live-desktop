/* eslint-disable no-console */

const { spawn } = require('child_process')

// those wordings are dynamically created, so they are detected
// as false positive
const WHITELIST = [
  'operation.type.IN',
  'operation.type.OUT',
  'exchange.coinhouse',
  'exchange.changelly',
  'exchange.coinmama',
  'exchange.simplex',
  'exchange.paybis',
  'addAccounts.accountToImportSubtitle_plural',
  'dashboard.summary_plural',
  'addAccounts.success_plural',
  'addAccounts.successDescription_plural',
  'time.since.day',
  'time.since.week',
  'time.since.month',
  'time.since.year',
  'time.day',
  'time.week',
  'time.month',
  'time.year',
  'addAccounts.cta.add_plural',
  'manager.apps.installing',
  'manager.apps.uninstalling',
  'manager.apps.installSuccess',
  'manager.apps.uninstallSuccess',
]

const WORDINGS = {
   require('../static/i18n/en/app.json'),
  onboarding: require('../static/i18n/en/onboarding.json'),
  // errors: require('../static/i18n/en/errors.json'),
  // language: require('../static/i18n/en/language.json'),
}

async function main() {
  console.log(`>> Checking for unused wordings...`)
  for (const ns in WORDINGS) {
    if (WORDINGS.hasOwnProperty(ns)) {
      try {
        const root = WORDINGS[ns]
        await checkForUsage(root, ns, ':')
      } catch (err) {
        console.log(err)
      }
    }
  }
  console.log(`>> Checking for duplicates...`)
  for (const ns in WORDINGS) {
    if (WORDINGS.hasOwnProperty(ns)) {
      try {
        const root = WORDINGS[ns]
        checkForDuplicate(root, ns, {}, ':')
      } catch (err) {
        console.log(err)
      }
    }
  }
}

function checkForDuplicate(v, key, values, delimiter = '.') {
  if (typeof v === 'object') {
    for (const k in v) {
      if (v.hasOwnProperty(k)) {
        checkForDuplicate(v[k], `${key}${delimiter}${k}`, values)
      }
    }
  } else if (typeof v === 'string') {
    if (values[v]) {
      console.log(`duplicate value [${v}] for key ${key} (exists in [${values[v].join(', ')}])`)
      values[v].push(key)
    } else {
      values[v] = [key]
    }
  } else {
    console.log(v)
    throw new Error('invalid input')
  }
}

async function checkForUsage(v, key, delimiter = '.') {
  if (WHITELIST.includes(key)) {
    return
  }
  if (typeof v === 'object') {
    for (const k in v) {
      if (v.hasOwnProperty(k)) {
        await checkForUsage(v[k], `${key}${delimiter}${k}`)
      }
    }
  } else if (typeof v === 'string') {
    try {
      const hasOccurences = await getHasOccurrences(key)
      if (!hasOccurences) {
        console.log(key)
      }
    } catch (err) {
      console.log(err)
    }
  } else {
    throw new Error('invalid input')
  }
}

function getHasOccurrences(key) {
  return new Promise(resolve => {
    const childProcess = spawn('rg', [key, 'src'])
    let data
    childProcess.stdout.on('data', d => {
      data = d.toString()
    })
    childProcess.on('close', () => {
      if (!data) return resolve(false)
      const rows = data.split('\n').filter(Boolean)
      return resolve(rows.length > 0)
    })
    childProcess.on('error', err => {
      if (err.code === 'ENOENT') {
        console.log(`You need to install ripgrep first`)
        console.log(`see: https://github.com/BurntSushi/ripgrep`)
        process.exit(1)
      }
    })
  })
}

main()
