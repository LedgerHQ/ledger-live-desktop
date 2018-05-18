// @flow

import type { IPCSend } from 'types/electron'

import { createTransportHandler, uninstallApp } from './helpers'

export default (send: IPCSend, data: any) =>
  createTransportHandler(send, {
    action: uninstallApp,
    successResponse: 'manager.appUninstalled',
    errorResponse: 'manager.appUninstallError',
  })(data)
