// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'

import type { MapStateToProps } from 'react-redux'
import type { Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'
import { sendEvent } from 'renderer/events'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import CopyToClipboard from 'components/base/CopyToClipboard'
import Icon from 'components/base/Icon'
import Print from 'components/base/Print'
import QRCode from 'components/base/QRCode'
import Text from 'components/base/Text'

export const AddressBox = styled(Box).attrs({
  bg: 'lightGrey',
  p: 2,
})`
  border-radius: 3px;
  border: 1px solid ${p => p.theme.colors.fog};
  cursor: text;
  text-align: center;
  user-select: text;
  word-break: break-all;
`

const Action = styled(Box).attrs({
  alignItems: 'center',
  color: 'fog',
  flex: 1,
  flow: 1,
  fontSize: 0,
})`
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    color: ${p => p.theme.colors.grey};
  }
`

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  currentDevice: getCurrentDevice(state),
})

type Props = {
  currentDevice: Device | null,
  address: string,
  amount?: string,
  path: string,
}

type State = {
  isVerified: null | boolean,
  isDisplay: boolean,
}

const defaultState = {
  isVerified: null,
  isDisplay: false,
}

class ReceiveBox extends PureComponent<Props, State> {
  static defaultProps = {
    amount: undefined,
  }

  state = {
    ...defaultState,
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleMsgEvent)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.address !== nextProps.address) {
      this.setState({
        ...defaultState,
      })
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleMsgEvent)
    this.setState({
      ...defaultState,
    })
  }

  handleMsgEvent = (e, { type }) => {
    if (type === 'wallet.verifyAddress.success') {
      this.setState({
        isVerified: true,
      })
    }

    if (type === 'wallet.verifyAddress.fail') {
      this.setState({
        isVerified: false,
      })
    }
  }

  handleVerifyAddress = () => {
    const { currentDevice, path } = this.props

    if (currentDevice !== null) {
      sendEvent('usb', 'wallet.verifyAddress', {
        pathDevice: currentDevice.path,
        path,
      })

      this.setState({
        isDisplay: true,
      })
    }
  }

  render() {
    const { amount, address } = this.props
    const { isVerified, isDisplay } = this.state

    if (!isDisplay) {
      return (
        <Box grow alignItems="center" justifyContent="center">
          <Button onClick={this.handleVerifyAddress}>Display address on device</Button>
        </Box>
      )
    }

    return (
      <Box flow={3}>
        <Box>
          isVerified:{' '}
          {isVerified === null
            ? 'not yet...'
            : isVerified === true ? 'ok!' : '/!\\ contact support'}
        </Box>
        <Box alignItems="center">
          <QRCode size={150} data={`bitcoin:${address}${amount ? `?amount=${amount}` : ''}`} />
        </Box>
        <Box alignItems="center" flow={2}>
          <Text fontSize={1}>{'Current address'}</Text>
          <AddressBox>{address}</AddressBox>
        </Box>
        <Box horizontal>
          <CopyToClipboard
            data={address}
            render={copy => (
              <Action onClick={copy}>
                <Icon name="clone" />
                <span>{'Copy'}</span>
              </Action>
            )}
          />
          <Print
            data={{ address, amount }}
            render={(print, isLoading) => (
              <Action onClick={print}>
                <Icon name="print" />
                <span>{isLoading ? '...' : 'Print'}</span>
              </Action>
            )}
          />
          <Action>
            <Icon name="share-square" />
            <span>{'Share'}</span>
          </Action>
        </Box>
      </Box>
    )
  }
}

export default connect(mapStateToProps, null)(ReceiveBox)
