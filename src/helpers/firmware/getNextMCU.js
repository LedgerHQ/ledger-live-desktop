// @flow
import network from 'api/network'

import { GET_NEXT_MCU } from 'helpers/urls'
import type { OsuFirmware } from 'helpers/types'
import { LatestMCUInstalledError } from '@ledgerhq/live-common/lib/errors'

type NetworkResponse = { data: OsuFirmware | 'default' }

export default async (bootloaderVersion: string): Promise<*> => {
  const { data }: NetworkResponse = await network({
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
