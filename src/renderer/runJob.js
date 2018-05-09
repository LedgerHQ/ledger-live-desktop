// @flow

import { ipcRenderer } from 'electron'

export default function runJob({
  channel,
  job,
  successResponse,
  errorResponse,
  data,
}: {
  channel: string,
  job: string,
  successResponse: string,
  errorResponse: string,
  data?: any,
}): Promise<void> {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(channel, { type: job, data })
    ipcRenderer.on('msg', handler)
    function handler(e, res) {
      const { type, data } = res
      if (![successResponse, errorResponse].includes(type)) {
        return
      }
      ipcRenderer.removeListener('msg', handler)
      if (type === successResponse) {
        resolve(data)
      } else if (type === errorResponse) {
        reject(data)
      }
    }
  })
}
