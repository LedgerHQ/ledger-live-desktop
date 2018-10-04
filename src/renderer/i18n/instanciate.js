import { HIGHLIGHT_I18N } from 'config/constants'
import i18n from 'i18next'

const commonConfig = {
  defaultNS: 'app',
  fallbackLng: 'en',
  debug: false,
  compatibilityJSON: 'v2',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  react: {
    wait: process.env.NODE_ENV !== 'test',
  },
}

const highlightPostProcessor = {
  type: 'postProcessor',
  name: 'highlight',
  process: value => `!!${value}!!`,
}

function addPluralRule(i18n) {
  i18n.services.pluralResolver.addRule('en', {
    numbers: [0, 1, 'plural'],
    plurals: n => Number(n >= 2 ? 2 : n),
  })
  return i18n
}

export function createWithBackend(backend, backendOpts) {
  const config = {
    ...commonConfig,
    ...backendOpts,
  }

  if (HIGHLIGHT_I18N) {
    config.postProcess = 'highlight'
  }

  i18n
    .use(backend)
    .use(highlightPostProcessor)
    .init(config)
  return addPluralRule(i18n)
}

export function createWithResources(resources) {
  i18n.init({
    ...commonConfig,
    ...resources,
  })
  return addPluralRule(i18n)
}
