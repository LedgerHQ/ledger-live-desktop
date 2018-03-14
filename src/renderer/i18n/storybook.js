import { createWithResources } from './instanciate'

const resources = {
  account: require('../../../static/i18n/en/account.yml'),
  accountsOrder: require('../../../static/i18n/en/accountsOrder.yml'),
  addAccount: require('../../../static/i18n/en/addAccount.yml'),
  common: require('../../../static/i18n/en/common.yml'),
  dashboard: require('../../../static/i18n/en/dashboard.yml'),
  device: require('../../../static/i18n/en/device.yml'),
  language: require('../../../static/i18n/en/language.yml'),
  receive: require('../../../static/i18n/en/receive.yml'),
  send: require('../../../static/i18n/en/send.yml'),
  settings: require('../../../static/i18n/en/settings.yml'),
  sidebar: require('../../../static/i18n/en/sidebar.yml'),
  time: require('../../../static/i18n/en/time.yml'),
  operationsList: require('../../../static/i18n/en/operationsList.yml'),
  update: require('../../../static/i18n/en/update.yml'),
}

export default createWithResources({ en: resources })
