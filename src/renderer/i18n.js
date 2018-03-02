// @flow

import i18n from 'i18next'
import path from 'path'
import Backend from 'i18next-node-fs-backend'

import staticPath from 'helpers/staticPath'

i18n.use(Backend).init({
  ns: [
    'account',
    'accountsOrder',
    'addAccount',
    'common',
    'dashboard',
    'device',
    'language',
    'receive',
    'send',
    'settings',
    'sidebar',
    'time',
    'transactionsList',
    'update',
  ],
  fallbackLng: 'en',
  debug: false,
  backend: {
    loadPath: path.join(staticPath, '/i18n/{{lng}}/{{ns}}.yml'),
  },
  react: {
    wait: true,
  },
})

i18n.services.pluralResolver.addRule('en', {
  numbers: [0, 1, 'plural'],
  plurals: n => Number(n >= 2 ? 2 : n),
})

export default i18n
