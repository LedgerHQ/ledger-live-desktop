// @flow
import React, { Fragment, useState, useCallback } from 'react'
import { getEnv } from '@ledgerhq/live-common/lib/env'
import type { DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'
import HookDeviceChange from './HookDeviceChange'
import Dashboard from './Dashboard'
import ManagerGenuineCheck from './ManagerGenuineCheck'

export const getManagerPageRoute = () =>
  getEnv('EXPERIMENTAL_MANAGER') ? '/managerv2' : '/manager'

const ManagerV2Page = () => {
  const [isGenuine, setIsGenuine] = useState(null)
  const [device, setDevice] = useState(null)
  const [deviceInfo, setDeviceInfo] = useState(null)

  const resetState = useCallback(() => {
    setIsGenuine(null)
    setDevice(null)
    setDeviceInfo(null)
  }, [setDevice, setIsGenuine, setDeviceInfo])

  const handleSuccessGenuine = useCallback(
    ({ device, deviceInfo }: { device: Device, deviceInfo: DeviceInfo }) => {
      setIsGenuine(true)
      setDevice(device)
      setDeviceInfo(deviceInfo)
    },
    [setDevice, setIsGenuine, setDeviceInfo],
  )

  if (!isGenuine) {
    return <ManagerGenuineCheck onSuccess={handleSuccessGenuine} />
  }
  // TODO perhaps we dont need the genuine check in this flow

  return (
    <Fragment>
      <HookDeviceChange onDeviceChanges={resetState} onDeviceDisconnected={resetState} />
      <Dashboard device={device} deviceInfo={deviceInfo} />
    </Fragment>
  )
}

export default ManagerV2Page
