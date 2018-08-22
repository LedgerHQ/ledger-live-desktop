// @flow
import network from 'api/network'

import { GET_NEXT_MCU } from 'helpers/urls'
import { createCustomErrorClass } from 'helpers/errors'

const LatestMCUInstalledError = createCustomErrorClass('LatestMCUInstalledError')

export default async (bootloaderVersion: string): Promise<*> => {
  const { data } = await network({
    method: 'POST',
    url: GET_NEXT_MCU,
    data: {
      bootloader_version: bootloaderVersion,
    },
  })

  // FIXME: nextVersion will not be able to "default" when
  // Error handling is standardize on the API side
  if (data === 'default' || !data.name) {
    throw new LatestMCUInstalledError('there is no next mcu version to install')
  }
  return data
}
