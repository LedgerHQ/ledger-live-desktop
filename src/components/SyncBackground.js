// @flow

import React, { PureComponent } from 'react'
import { BridgeSyncConsumer } from 'bridge/BridgeSyncContext'
import type { Sync } from 'bridge/BridgeSyncContext'

import { SYNC_BOOT_DELAY, SYNC_ALL_INTERVAL } from 'config/constants'

export class Effect extends PureComponent<{
  sync: Sync,
}> {
  componentDidMount() {
    const syncLoop = async () => {
      const { sync } = this.props
      sync({ type: 'BACKGROUND_TICK' })
      this.syncTimeout = setTimeout(syncLoop, SYNC_ALL_INTERVAL)
    }
    this.syncTimeout = setTimeout(syncLoop, SYNC_BOOT_DELAY)
  }

  componentWillUnmount() {
    clearTimeout(this.syncTimeout)
  }

  syncTimeout: *

  render() {
    return null
  }
}

const SyncBackground = () => (
  <BridgeSyncConsumer>{sync => <Effect sync={sync} />}</BridgeSyncConsumer>
)

export default SyncBackground
