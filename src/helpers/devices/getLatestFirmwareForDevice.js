// @flow
import network from 'api/network'
import { GET_LATEST_FIRMWARE } from 'helpers/urls'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'

import getFinalFirmwareById from 'helpers/firmware/getFinalFirmwareById'
import getMcus from 'helpers/firmware/getMcus'

import getCurrentFirmware from './getCurrentFirmware'
import getDeviceVersion from './getDeviceVersion'

export default async (deviceInfo: DeviceInfo) => {
  // Get device infos from targetId
  const deviceVersion = await getDeviceVersion(deviceInfo.targetId, deviceInfo.providerId)

  // Get firmware infos with firmware name and device version
  const seFirmwareVersion = await getCurrentFirmware({
    fullVersion: deviceInfo.fullVersion,
    deviceId: deviceVersion.id,
    provider: deviceInfo.providerId,
  })

  // Fetch next possible firmware
  const { data } = await network({
    method: 'POST',
    url: GET_LATEST_FIRMWARE,
    data: {
      current_se_firmware_final_version: seFirmwareVersion.id,
      device_version: deviceVersion.id,
      provider: deviceInfo.providerId,
    },
  })

  if (data.result === 'null') {
    return null
  }

  const { se_firmware_osu_version } = data
  const { next_se_firmware_final_version } = se_firmware_osu_version
  const seFirmwareFinalVersion = await getFinalFirmwareById(next_se_firmware_final_version)

  const mcus = await getMcus()

  const currentMcuVersionId = mcus
    .filter(mcu => mcu.name === deviceInfo.mcuVersion)
    .map(mcu => mcu.id)

  if (!seFirmwareFinalVersion.mcu_versions.includes(...currentMcuVersionId)) {
    return {
      ...se_firmware_osu_version,
      shouldFlashMcu: true,
    }
  }

  return { ...se_firmware_osu_version, shouldFlashMcu: false }
}
