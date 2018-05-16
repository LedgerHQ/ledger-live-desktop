// @flow

import type { IPCSend } from 'types/electron'

export default async (send: IPCSend, data: any) => {
  /**
   * 1 CREATE TRANSPORT
   * 2 GETFIRMWARE INFOS
   * 3 SEND
   */
  console.log(data)
}
// createTransportHandler(send, {
//   action: installFirmware,
//   successResponse: 'manager.appInstalled',
//   errorResponse: 'manager.appInstallError',
// })(data)
