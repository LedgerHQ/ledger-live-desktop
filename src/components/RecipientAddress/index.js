// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import noop from 'lodash/noop'
import { decodeURIScheme } from '@ledgerhq/live-common/lib/helpers/currencies'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import { radii } from 'styles/theme'

import QRCodeCameraPickerCanvas from 'components/QRCodeCameraPickerCanvas'
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
  onChange: (string, ?{ amount?: number, currency?: CryptoCurrency }) => ?boolean,
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

  handleClickQrCode = () =>
    this.setState(prev => ({
      qrReaderOpened: !prev.qrReaderOpened,
    }))

  handleOnPick = (code: string) => {
    const { address, ...rest } = decodeURIScheme(code)
    if (this.props.onChange(address, rest) !== false) {
      this.setState({ qrReaderOpened: false })
    }
  }

  render() {
    const { onChange, withQrCode, value } = this.props
    const { qrReaderOpened } = this.state

    return (
      <Box relative justifyContent="center">
        <Input
          value={value}
          withQrCode={withQrCode}
          onChange={onChange}
          renderRight={
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
          }
        />
      </Box>
    )
  }
}

export default RecipientAddress
