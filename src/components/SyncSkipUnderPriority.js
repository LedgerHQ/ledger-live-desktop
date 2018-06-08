// @flow

import React, { PureComponent } from 'react'
import { BridgeSyncConsumer } from 'bridge/BridgeSyncContext'
import type { Sync } from 'bridge/BridgeSyncContext'

const instances = []

export class Effect extends PureComponent<{
  sync: Sync,
  priority: number, // eslint-disable-line
}> {
  componentDidMount() {
    instances.push(this)
    this.check()
  }
  componentDidUpdate() {
    this.check()
  }
  componentWillUnmount() {
    const i = instances.indexOf(this)
    if (i !== -1) {
      instances.splice(i, 1)
      this.check()
    }
  }
  check() {
    const { sync } = this.props
    const priority = instances.length === 0 ? -1 : Math.max(...instances.map(i => i.props.priority))
    sync({ type: 'SET_SKIP_UNDER_PRIORITY', priority })
  }
  render() {
    return null
  }
}

const SyncSkipUnderPriority = ({ priority }: { priority: number }) => (
  <BridgeSyncConsumer>{sync => <Effect sync={sync} priority={priority} />}</BridgeSyncConsumer>
)

export default SyncSkipUnderPriority
