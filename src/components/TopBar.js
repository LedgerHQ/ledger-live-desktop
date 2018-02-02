// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'

import type { MapStateToProps, MapDispatchToProps } from 'react-redux'

import { getAccounts } from 'reducers/accounts'
import { lock } from 'reducers/application'
import { hasPassword } from 'reducers/settings'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  borderColor: 'grey',
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

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  hasAccounts: Object.keys(getAccounts(state)).length > 0,
  hasPassword: hasPassword(state),
})

const mapDispatchToProps: MapDispatchToProps<*, *, *> = {
  lock,
}

type Props = {
  hasAccounts: boolean,
  hasPassword: boolean,
  lock: Function,
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

  handleLock = () => this.props.lock()

  render() {
    const { hasPassword, hasAccounts } = this.props
    const { sync } = this.state

    return (
      <Container bg="cream">
        <Box grow>
          {hasAccounts &&
            (sync.progress === true
              ? 'Synchronizing...'
              : sync.fail === true ? 'Synchronization fail :(' : 'Synchronisation finished!')}
        </Box>
        <Box justify="flex-end" horizontal>
          {hasPassword && <LockApplication onLock={this.handleLock} />}
        </Box>
      </Container>
    )
  }
}

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
