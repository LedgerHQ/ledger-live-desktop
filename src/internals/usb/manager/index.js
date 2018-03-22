// @flow

/**
 *                                  Manager
 *                                  -------
 *
 *                                    xXx
 *                                    xXx
 *                                    xXx
 *                                  xxxXxxx
 *                                   xxXxx
 *                                    xXx
 *                               xX    x    Xx
 *                               xX         Xx
 *                                xxXXXXXXXxx
 *
 */

import type { IPCSend } from 'types/electron'
import { createTransportHandler, installApp, uninstallApp } from './helpers'

export default (send: IPCSend) => ({
  installApp: createTransportHandler(send, {
    action: installApp,
    successResponse: 'device.appInstalled',
    errorResponse: 'device.appInstallError',
  }),

  uninstallApp: createTransportHandler(send, {
    action: uninstallApp,
    successResponse: 'device.appUninstalled',
    errorResponse: 'device.appUninstallError',
  }),
})
