// @flow

import path from 'path'
import FSBackend from 'i18next-node-fs-backend'

import staticPath from 'helpers/staticPath'
import { createWithBackend } from './instanciate'

export default createWithBackend(FSBackend, {
  loadPath: path.join(staticPath, '/i18n/{{lng}}/{{ns}}.yml'),
})
