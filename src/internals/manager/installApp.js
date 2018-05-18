// @flow

import type { IPCSend } from 'types/electron'

import { createTransportHandler, installApp } from './helpers'

export default (send: IPCSend, data: any) =>
  createTransportHandler(send, {
    action: installApp,
    successResponse: 'manager.appInstalled',
    errorResponse: 'manager.appInstallError',
  })(data)
