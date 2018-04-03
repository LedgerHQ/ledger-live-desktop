import i18n from 'i18next'

const commonConfig = {
  fallbackLng: 'en',
  debug: false,
  react: {
    wait: true,
  },
}

function addPluralRule(i18n) {
  i18n.services.pluralResolver.addRule('en', {
    numbers: [0, 1, 'plural'],
    plurals: n => Number(n >= 2 ? 2 : n),
  })
  return i18n
}

export function createWithBackend(backend, backendOpts) {
  i18n.use(backend).init({
    ...commonConfig,
    ...backendOpts,
  })
  return addPluralRule(i18n)
}

export function createWithResources(resources) {
  i18n.init({
    ...commonConfig,
    ...resources,
  })
  return addPluralRule(i18n)
}
