// @flow
import React, { useCallback, useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import type { T, Device } from 'types/common'
import type { DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import TrackPage from 'analytics/TrackPage'
import styled from 'styled-components'
import AppList from './AppsList'
import appOpExec from 'commands/appOpExec'
import listApps from 'commands/listApps'
import { getActionPlan, useAppsRunner } from '@ledgerhq/live-common/lib/apps'
import { list } from '@ledgerhq/hw-app-eth/lib/erc20'
import TranslatedError from '../TranslatedError'

type Props = {
  t: T,
  device: Device,
  deviceInfo: DeviceInfo,
  handleHelpRequest: () => void,
}

const FluidGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: minmax(200px, 2000px) 1fr 1fr;

  /* Col1 */
  & > :nth-child(1) {
    border: 1px solid red;
    padding: 20px;
  }

  & > :nth-child(1),
  & > :nth-child(2) {
    min-width: 200px;
  }

  /* Col2 (or not) */
  & > :nth-child(2) div {
    border: 1px solid blue;
    padding: 20px;
    min-width: 200px;
  }
`

const Dashboard = ({ device, deviceInfo, t, handleHelpRequest }: Props) => {
  const [listAppsRes, setListAppsRes] = useState(null)
  const [devicePermissionRequested, setDevicePermissionRequested] = useState(null)
  const [error, setError] = useState(null)

  const exec = useCallback(
    (appOp, targetId, app) => appOpExec.send({ appOp, targetId, app, devicePath: device.path }),
    [device],
  )

  useEffect(() => {
    if (device && deviceInfo) {
      const subscription = listApps.send({ devicePath: device.path, deviceInfo }).subscribe({
        error: setError,
        next: e => {
          if (e.type === 'result') {
            setListAppsRes(e.result)
          } else if (e.type === 'device-permission-requested') {
            setDevicePermissionRequested({ wording: e.wording })
          } else if (e.type === 'device-permission-granted') {
            setDevicePermissionRequested(null)
          }
        },
      })
      return () => subscription.unsubscribe()
    }
    return undefined
  }, [device, deviceInfo, setListAppsRes])

  const canRenderListApps = listAppsRes && exec

  // @gre I have everything inside the AppList because I needed to make it conditional to the list being ready
  // feel free to reorder this
  return (
    <Box flow={4} pb={8} selectable>
      <TrackPage category="Manager" name="Dashboard" />
      {error ? <TranslatedError error={error} /> : null}
      {canRenderListApps ? (
        <AppList device={device} deviceInfo={deviceInfo} listAppsRes={listAppsRes} exec={exec} />
      ) : devicePermissionRequested ? (
        'Asking for permission'
      ) : (
        <Text fontSize={80}>{'Loading ¯\\_(ツ)_/¯'}</Text>
      )}
    </Box>
  )
}

export default translate()(Dashboard)
