// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'
import noop from 'lodash/noop'

import { radii } from 'styles/theme'

import Box from 'components/base/Box'
import Input from 'components/base/Input'

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
`

type Props = {
  value: string,
  onChange: Function,
  qrCodeSize: number,
  withQrCode: boolean,
}

type State = {
  qrReaderOpened: boolean,
}

class RecipientAddress extends PureComponent<Props, State> {
  static defaultProps = {
    value: '',
    onChange: noop,
    qrCodeSize: 200,
    withQrCode: true,
  }

  state = {
    qrReaderOpened: false,
  }

  handleClickQrCode = () =>
    this.setState(prev => ({
      qrReaderOpened: !prev.qrReaderOpened,
    }))

  handleScanQrCode = (data: string) => data !== null && this.props.onChange(data)

  render() {
    const { onChange, qrCodeSize, withQrCode, value } = this.props
    const { qrReaderOpened } = this.state

    return (
      <Box relative justifyContent="center">
        <Input
          value={value}
          withQrCode={withQrCode}
          onChange={onChange}
          renderRight={
            <Right onClick={this.handleClickQrCode}>
              <IconQrCode width={16} height={16} />
              {qrReaderOpened && (
                <WrapperQrCode>
                  <QrReader
                    onScan={this.handleScanQrCode}
                    onError={noop}
                    style={{ height: qrCodeSize, width: qrCodeSize }}
                  />
                </WrapperQrCode>
              )}
            </Right>
          }
        />
      </Box>
    )
  }
}

export default RecipientAddress
