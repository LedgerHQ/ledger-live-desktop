// @flow

import React, { Component } from 'react'
import { BridgeSyncConsumer } from 'bridge/BridgeSyncContext'
import type { Sync } from 'bridge/BridgeSyncContext'

export class Effect extends Component<{
  sync: Sync,
  accountId: string,
  priority: number,
}> {
  componentDidMount() {
    const { sync, accountId, priority } = this.props
    sync({ type: 'SYNC_ONE_ACCOUNT', accountId, priority })
  }
  componentDidUpdate(prevProps: *) {
    const { sync, accountId, priority } = this.props
    if (accountId !== prevProps.accountId) {
      sync({ type: 'SYNC_ONE_ACCOUNT', accountId, priority })
    }
  }
  render() {
    return null
  }
}

const SyncOneAccountOnMount = ({
  accountId,
  priority,
}: {
  accountId: string,
  priority: number,
}) => (
  <BridgeSyncConsumer>
    {sync => <Effect sync={sync} accountId={accountId} priority={priority} />}
  </BridgeSyncConsumer>
)

export default SyncOneAccountOnMount
