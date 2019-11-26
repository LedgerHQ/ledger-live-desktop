// @flow
import React, { useCallback } from 'react'
import { translate } from 'react-i18next'
import type { Device } from 'types/common'
import type { DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'
import type { ListAppsResult } from '@ledgerhq/live-common/lib/apps/types'

import Box from 'components/base/Box'
import TrackPage from 'analytics/TrackPage'
import appOpExec from 'commands/appOpExec'
import AppList from './AppsList'

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  listAppsRes: ?ListAppsResult,
}

const Dashboard = ({ device, deviceInfo, listAppsRes }: Props) => {
  const exec = useCallback(
    (appOp, targetId, app) => appOpExec.send({ appOp, targetId, app, devicePath: device.path }),
    [device],
  )

  // @gre I have everything inside the AppList because I needed to make it conditional to the list being ready
  // feel free to reorder this
  return (
    <Box flow={4} pb={8} selectable>
      <TrackPage category="Manager" name="Dashboard" />
      {listAppsRes ? (
        <AppList device={device} deviceInfo={deviceInfo} listAppsRes={listAppsRes} exec={exec} />
      ) : null}
    </Box>
  )
}

export default translate()(Dashboard)
