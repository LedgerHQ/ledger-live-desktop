// @flow

import path from 'path'
import rimraf from 'rimraf'
import resolveUserDataDirectory from './resolveUserDataDirectory'

export const cleanUpBeforeClosingSync = () => {
  rimraf.sync(path.resolve(resolveUserDataDirectory(), 'sqlite/*.log'))
}
