// @flow

import fs from 'fs'
import path from 'path'
import FSBackend from 'i18next-node-fs-backend'

import staticPath from 'helpers/staticPath'
import { createWithBackend } from './instanciate'

const ns = p =>
  fs
    .readdirSync(p)
    .filter(f => !fs.statSync(path.join(p, f)).isDirectory())
    .map(file => file.split('.json')[0])

export default createWithBackend(FSBackend, {
  ns: ns(path.join(staticPath, '/i18n/en')),
  backend: {
    loadPath: path.join(staticPath, '/i18n/{{lng}}/{{ns}}.json'),
  },
})
