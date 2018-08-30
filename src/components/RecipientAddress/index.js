// @flow

import type { BigNumber } from 'bignumber.js'
import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import noop from 'lodash/noop'
import { decodeURIScheme } from '@ledgerhq/live-common/lib/helpers/currencies'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import { radii } from 'styles/theme'

import QRCodeCameraPickerCanvas from 'components/QRCodeCameraPickerCanvas'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import { track } from 'analytics/segment'

import IconQrCode from 'icons/QrCode'

const Right = styled(Box).attrs({
  bg: 'lightGrey',
  px: 3,
  align: 'center',
  justify: 'center',
})`
  border-top-right-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
  border-left: 1px solid ${p => p.theme.colors.fog};
`

const WrapperQrCode = styled(Box)`
  margin-top: 10px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 3;
`

const BackgroundLayer = styled(Box)`
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`

type Props = {
  value: string,
  // return false if it can't be changed (invalid info)
  onChange: (string, ?{ amount?: BigNumber, currency?: CryptoCurrency }) => Promise<?boolean>,
  withQrCode: boolean,
}

type State = {
  qrReaderOpened: boolean,
}

class RecipientAddress extends PureComponent<Props, State> {
  static defaultProps = {
    value: '',
    onChange: noop,
    withQrCode: true,
  }

  state = {
    qrReaderOpened: false,
  }

  handleClickQrCode = () => {
    const { qrReaderOpened } = this.state
    this.setState(prev => ({
      qrReaderOpened: !prev.qrReaderOpened,
    }))
    !qrReaderOpened ? track('Send Flow QR Code Opened') : track('Send Flow QR Code Closed')
  }

  handleOnPick = (code: string) => {
    const { address, ...rest } = decodeURIScheme(code)
    // $FlowFixMe
    Object.assign(rest, { fromQRCode: true })
    if (this.props.onChange(address, rest) !== false) {
      this.setState({ qrReaderOpened: false })
    }
  }

  render() {
    const { onChange, withQrCode, value, ...rest } = this.props
    const { qrReaderOpened } = this.state

    const renderRight = withQrCode ? (
      <Right onClick={this.handleClickQrCode}>
        <IconQrCode size={16} />
        {qrReaderOpened && (
          <Fragment>
            <BackgroundLayer />
            <WrapperQrCode>
              <QRCodeCameraPickerCanvas onPick={this.handleOnPick} />
            </WrapperQrCode>
          </Fragment>
        )}
      </Right>
    ) : null

    const preOnChange = text => onChange((text && text.replace(/\s/g, '')) || '')
    return (
      <Box relative justifyContent="center">
        <Input {...rest} value={value} onChange={preOnChange} renderRight={renderRight} />
      </Box>
    )
  }
}

export default RecipientAddress
