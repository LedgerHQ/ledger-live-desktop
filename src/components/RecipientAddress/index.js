// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'
import noop from 'lodash/noop'

import Box from 'components/base/Box'
import Icon from 'components/base/Icon'
import Input from 'components/base/Input'

const IconQrCode = ({ onClick }: { onClick: Function }) => (
  <Box color="graphite" style={{ position: 'absolute', right: 15 }}>
    <Icon fontSize={30} name="qrcode" style={{ cursor: 'pointer' }} onClick={onClick} />
  </Box>
)

const InputAddress = styled(Input).attrs({
  type: 'text',
})`
  padding-right: ${p => p.withQrCode && '55px'};
`

const WrapperQrCode = styled(Box)`
  margin-top: 10px;
  position: absolute;
  right: 15px;
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
        <InputAddress value={value} withQrCode={withQrCode} onChange={onChange} />
        {withQrCode && (
          <Fragment>
            <IconQrCode onClick={this.handleClickQrCode} />
            {qrReaderOpened && (
              <WrapperQrCode>
                <QrReader
                  onScan={this.handleScanQrCode}
                  onError={noop}
                  style={{ height: qrCodeSize, width: qrCodeSize }}
                />
              </WrapperQrCode>
            )}
          </Fragment>
        )}
      </Box>
    )
  }
}

export default RecipientAddress
