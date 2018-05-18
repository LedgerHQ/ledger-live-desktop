// @flow

import type { IPCSend } from 'types/electron'

import { createTransportHandler, getMemInfos } from './helpers'

export default (send: IPCSend, data: any) =>
  createTransportHandler(send, {
    action: getMemInfos,
    successResponse: 'manager.getMemInfosSuccess',
    errorResponse: 'manager.getMemInfosError',
  })(data)
