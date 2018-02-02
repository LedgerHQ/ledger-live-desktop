// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'

import type { MapStateToProps, MapDispatchToProps } from 'react-redux'
import type { Devices } from 'types/common'
import type { SetCurrentDevice } from 'actions/devices'

import { getDevices, getCurrentDevice } from 'reducers/devices'
import { getAccounts } from 'reducers/accounts'
import { setCurrentDevice } from 'actions/devices'
import { lock } from 'reducers/application'
import { hasPassword } from 'reducers/settings'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  borderColor: '#e2e2e2',
  borderWidth: 1,
  borderBottom: true,
  noShrink: true,
  px: 3,
  align: 'center',
  horizontal: true,
})`
  height: 60px;
  position: absolute;
  overflow: hidden;
  left: 0;
  right: 0;
  top: 0;
  z-index: 20;
`

const Filter = styled.div`
  background: ${p => p.theme.colors.cream};
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;
`

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  hasAccounts: Object.keys(getAccounts(state)).length > 0,
  currentDevice: getCurrentDevice(state),
  devices: getDevices(state),
  hasPassword: hasPassword(state),
})

const mapDispatchToProps: MapDispatchToProps<*, *, *> = {
  setCurrentDevice,
  lock,
}

type Props = {
  hasAccounts: boolean,
  devices: Devices,
  hasPassword: boolean,
  lock: Function,
  setCurrentDevice: SetCurrentDevice,
}
type State = {
  sync: {
    progress: null | boolean,
    fail: boolean,
  },
}

class TopBar extends PureComponent<Props, State> {
  state = {
    sync: {
      progress: null,
      fail: false,
    },
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleAccountSync)
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleAccountSync)
  }

  handleAccountSync = (e, { type }) => {
    if (type === 'accounts.sync.progress') {
      this.setState({
        sync: {
          progress: true,
          fail: false,
        },
      })
    }

    if (type === 'accounts.sync.fail') {
      this.setState({
        sync: {
          progress: null,
          fail: true,
        },
      })
    }

    if (type === 'accounts.sync.success') {
      this.setState({
        sync: {
          progress: false,
          fail: false,
        },
      })
    }
  }

  handleSelectDevice = device => () => {
    const { setCurrentDevice } = this.props

    setCurrentDevice(device)
  }

  handleLock = () => this.props.lock()

  render() {
    const { devices, hasPassword, hasAccounts } = this.props
    const { sync } = this.state

    return (
      <Container>
        <Box grow>
          {hasAccounts &&
            (sync.progress === true
              ? 'Synchronizing...'
              : sync.fail === true ? 'Synchronization fail :(' : 'Synchronisation finished!')}
        </Box>
        <Box justify="flex-end" horizontal>
          {hasPassword && <LockApplication onLock={this.handleLock} />}
          <CountDevices count={devices.length} />
        </Box>
        <Filter />
      </Container>
    )
  }
}

const CountDevices = ({ count } = { count: Number }) => (
  <Box color="night" horizontal flow={10}>
    <Box>
      <DeviceIcon height={20} width={20} />
    </Box>
    <Box>{count}</Box>
  </Box>
)

const LockApplication = ({ onLock }: { onLock: Function }) => (
  <Box
    relative
    color="night"
    mr={20}
    horizontal
    flow={10}
    onClick={onLock}
    style={{ cursor: 'pointer' }}
  >
    <LockIcon height={20} width={20} />
  </Box>
)

const DeviceIcon = props => (
  <svg {...props} viewBox="0 0 19.781 19.781">
    <path
      d="M14.507 0L9.8 4.706a2.92 2.92 0 0 0-1.991.854l-6.89 6.889a2.93 2.93 0 0 0 0 4.143l2.33 2.33a2.925 2.925 0 0 0 4.141 0l6.89-6.891c.613-.612.895-1.43.851-2.232l4.589-4.588L14.507 0zm.386 8.792a2.927 2.927 0 0 0-.611-.902l-2.33-2.331a2.945 2.945 0 0 0-1.08-.682l3.637-3.636 3.968 3.969-3.584 3.582zm.693-5.381l-.949.949-1.26-1.26.949-.949 1.26 1.26zm1.881 1.882l-.949.949-1.26-1.26.948-.949 1.261 1.26z"
      fill="currentColor"
    />
  </svg>
)

const LockIcon = props => (
  <svg {...props} viewBox="0 0 482.8 482.8">
    <path
      d="M395.95 210.4h-7.1v-62.9c0-81.3-66.1-147.5-147.5-147.5-81.3 0-147.5 66.1-147.5 147.5 0 7.5 6 13.5 13.5 13.5s13.5-6 13.5-13.5c0-66.4 54-120.5 120.5-120.5 66.4 0 120.5 54 120.5 120.5v62.9h-275c-14.4 0-26.1 11.7-26.1 26.1v168.1c0 43.1 35.1 78.2 78.2 78.2h204.9c43.1 0 78.2-35.1 78.2-78.2V236.5c0-14.4-11.7-26.1-26.1-26.1zm-.9 194.2c0 28.2-22.9 51.2-51.2 51.2h-204.8c-28.2 0-51.2-22.9-51.2-51.2V237.4h307.2v167.2z"
      fill="currentColor"
    />
    <path
      d="M241.45 399.1c27.9 0 50.5-22.7 50.5-50.5 0-27.9-22.7-50.5-50.5-50.5-27.9 0-50.5 22.7-50.5 50.5s22.6 50.5 50.5 50.5zm0-74.1c13 0 23.5 10.6 23.5 23.5s-10.5 23.6-23.5 23.6-23.5-10.6-23.5-23.5 10.5-23.6 23.5-23.6z"
      fill="currentColor"
    />
  </svg>
)

export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
