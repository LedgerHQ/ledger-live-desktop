// @flow
import axios from 'axios'

import { GET_NEXT_MCU } from 'helpers/urls'
import createCustomErrorClass from 'helpers/createCustomErrorClass'

const LatestMCUInstalledError = createCustomErrorClass('LatestMCUInstalledError')

export default async (bootloaderVersion: string): Promise<*> => {
  try {
    const { data } = await axios.post(GET_NEXT_MCU, {
      bootloader_version: bootloaderVersion,
    })

    // FIXME: nextVersion will not be able to "default" when Error
    // handling is standardize on the API side
    if (data === 'default' || !data.name) {
      throw new LatestMCUInstalledError('there is no next mcu version to install')
    }
    return data
  } catch (err) {
    const error = Error(err.message)
    error.stack = err.stack
    throw err
  }
}
