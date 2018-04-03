import { createWithResources } from './instanciate'

const req = require.context('../../../static/i18n/en', true, /.yml$/)

const resources = req.keys().reduce((result, file) => {
  const [, fileName] = file.match(/\.\/(.*)\.yml/)
  result[fileName] = req(file)
  return result
}, {})

export default createWithResources({
  ns: Object.keys(resources),
  resources: {
    en: resources,
  },
})
