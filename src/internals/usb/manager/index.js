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
import axios from 'axios'
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

  listApps: async () => {
    try {
      const { data } = await axios.get('https://api.ledgerwallet.com/update/applications')
      send('manager.listAppsSuccess', data['nanos-1.4'])
    } catch (err) {
      send('manager.listAppsError', { message: err.message, stack: err.stack })
    }
  },
})
