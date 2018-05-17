// @flow
import axios from 'axios'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import isEmpty from 'lodash/isEmpty'

import type { IPCSend } from 'types/electron'

import { getFirmwareInfo } from './helpers'

const { API_BASE_URL } = process.env

export default async (send: IPCSend, data: any) => {
  try {
    const transport = await CommNodeHid.open(data.devicePath)
    const infos = await getFirmwareInfo(transport)
    // Get device infos from targetId
    const { data: deviceVersion } = await axios.get(
      `${API_BASE_URL}/device_versions_target_id/${infos.targetId}`,
    )

    // Get firmware infos with firmware name and device version
    const { data: seFirmwareVersion } = await axios.post(`${API_BASE_URL}/firmware_versions_name`, {
      device_version: deviceVersion.id,
      se_firmware_name: infos.version,
    })

    // Fetch next possible firmware
    const { data: serverData } = await axios.post(`${API_BASE_URL}/get_latest_firmware`, {
      current_se_firmware_version: seFirmwareVersion.id,
      device_version: deviceVersion.id,
      providers: [1],
    })

    const { se_firmware_version } = serverData

    if (!isEmpty(se_firmware_version)) {
      send('manager.getLatestFirmwareForDeviceSuccess', se_firmware_version)
    } else {
      send('manager.getLatestFirmwareForDeviceError', { name: 'yolo', notes: 'fake' })
    }
  } catch (error) {
    send('manager.getLatestFirmwareForDeviceError', { name: 'yolo', notes: 'fake', error })
  }
}
