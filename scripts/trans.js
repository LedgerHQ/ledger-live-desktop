#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

require('dotenv').config()

const path = require('path')
const fs = require('fs')
const axios = require('axios')
const querystring = require('querystring')
const forEach = require('lodash/forEach')
const objectPath = require('object-path')
const yaml = require('js-yaml')
const chalk = require('chalk')

const { LOKALISE_TOKEN, LOKALISE_PROJECT } = process.env
const BASE = 'https://api.lokalise.co/api'

const stats = {
  nb: 0,
}

main()

async function main() {
  try {
    console.log(`${chalk.blue('[>]')} ${chalk.dim('Fetching translations...')}`)
    const url = `${BASE}/string/list`
    const { data } = await axios.post(
      url,
      querystring.stringify({
        api_token: LOKALISE_TOKEN,
        id: LOKALISE_PROJECT,
      }),
    )
    if (data.response.status === 'error') {
      throw new Error(JSON.stringify(data.response))
    }
    const { strings } = data
    forEach(strings, syncLanguage)
    console.log(
      `${chalk.blue('[>]')} ${chalk.dim('Successfully imported')} ${stats.nb} ${chalk.dim(
        'translations',
      )}`,
    )
  } catch (err) {
    console.log(err)
    console.log(`${chalk.red('[x] Error in the process')}`)
    process.exit(1)
  }
}

function syncLanguage(translations, language) {
  const folderPath = getLanguageFolderPath(language)
  const filePath = path.resolve(folderPath, 'translation.yml')
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }
  const obj = translations.reduce((acc, cur) => {
    objectPath.set(acc, cur.key, cur.translation)
    console.log(`${chalk.green('[✓]')} ${language} ${chalk.dim(cur.key)}`)
    ++stats.nb
    return acc
  }, {})
  fs.writeFileSync(filePath, yaml.dump(obj))
}

function getLanguageFolderPath(language) {
  return path.resolve(__dirname, `../static/i18n/${language}`)
}
