import { createWithResources } from './instanciate'

const req = require.context('../../../static/i18n/en', true, /.json/)

const resources = req.keys().reduce((result, file) => {
  const [, fileName] = file.match(/\.\/(.*)\.json/)
  result[fileName] = req(file)
  return result
}, {})

export default createWithResources({
  ns: Object.keys(resources),
  resources: {
    en: resources,
  },
})
