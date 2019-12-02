// @flow
import React, { Fragment, useState, useCallback } from 'react'
import { getEnv } from '@ledgerhq/live-common/lib/env'
import HookDeviceChange from './HookDeviceChange'
import Dashboard from './Dashboard'
import ManagerConnect from './ManagerConnect'

export const getManagerPageRoute = () =>
  getEnv('EXPERIMENTAL_MANAGER') ? '/managerv2' : '/manager'

const ManagerV2Page = () => {
  const [connectResult, setConnectResult] = useState(null)

  const resetState = useCallback(() => {
    setConnectResult(null)
  }, [])

  const onConnect = useCallback(connectResult => {
    setConnectResult(connectResult)
  }, [])

  if (!connectResult) {
    return <ManagerConnect onSuccess={onConnect} />
  }

  return (
    <Fragment>
      <HookDeviceChange onDeviceChanges={resetState} onDeviceDisconnected={resetState} />
      <Dashboard {...connectResult} />
    </Fragment>
  )
}

export default ManagerV2Page
