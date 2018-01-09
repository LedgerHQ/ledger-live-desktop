// @flow

import i18n from 'i18next'
import path from 'path'
import Backend from 'i18next-node-fs-backend'

i18n.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  backend: {
    loadPath: path.resolve(__dirname, '../i18n/{{lng}}/{{ns}}.yml'),
  },
  react: {
    wait: true,
  },
})

export default i18n
