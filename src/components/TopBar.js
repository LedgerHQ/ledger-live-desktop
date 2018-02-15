// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'

import type { MapStateToProps, MapDispatchToProps } from 'react-redux'

import { rgba } from 'styles/helpers'
import { getAccounts } from 'reducers/accounts'
import { lock } from 'reducers/application'
import { hasPassword } from 'reducers/settings'

import IconDevices from 'icons/Devices'
import IconActivity from 'icons/Activity'
import IconAngleDown from 'icons/AngleDown'

import DropDown from 'components/base/DropDown'
import Box from 'components/base/Box'
import GlobalSearch from 'components/GlobalSearch'

const Container = styled(Box).attrs({
  px: 6,
})`
  height: ${p => p.theme.sizes.topBarHeight}px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 20;
`

const Inner = styled(Box).attrs({
  horizontal: true,
  grow: true,
  borderBottom: true,
  flow: 4,
  borderWidth: 1,
  borderColor: p => rgba(p.theme.colors.black, 0.15),
})``

const Bar = styled.div`
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors.mouse};
`

const Activity = styled.div`
  background: ${p =>
    p.progress === true
      ? p.theme.colors.dodgerBlue
      : p.fail === true ? p.theme.colors.grenade : p.theme.colors.green};
  border-radius: 50%;
  bottom: 20px;
  height: 4px;
  position: absolute;
  right: -2px;
  width: 4px;
`

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  hasAccounts: getAccounts(state).length > 0,
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
      <Container bg="cream" color="warmGrey">
        <Inner>
          <Box grow horizontal flow={4}>
            <GlobalSearch />
            <Box justify="center">
              <IconDevices height={16} width={16} />
            </Box>
            <Box justify="center" relative>
              <IconActivity height={16} width={16} />
              {hasAccounts && <Activity progress={sync.progress} fail={sync.fail} />}
            </Box>
            <Box justify="center">
              <Bar />
            </Box>
          </Box>
          <Box horizontal noShrink>
            <DropDown
              items={
                hasPassword
                  ? [{ key: 'lock', label: 'Lock application', onClick: this.handleLock }]
                  : []
              }
              ff="Open Sans|SemiBold"
              fontSize={4}
              offsetTop={-2}
              align="center"
              justify="center"
              flow={1}
              color="warmGrey"
              horizontal
            >
              <Box>{'Khalil Benihoud'}</Box>
              <IconAngleDown height={7} width={8} />
            </DropDown>
          </Box>
        </Inner>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
