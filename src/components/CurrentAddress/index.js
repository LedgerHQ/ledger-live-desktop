// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { T } from 'types/common'

import { rgba } from 'styles/helpers'

import Box from 'components/base/Box'
import QRCode from 'components/base/QRCode'

import IconInfoCircle from 'icons/InfoCircle'

const Container = styled(Box).attrs({
  borderRadius: 1,
  alignItems: 'center',
  bg: p => (p.withQRCode ? 'lightGrey' : 'transparent'),
  p: 5,
})``

const WrapperAddress = styled(Box).attrs({
  alignItems: 'center',
  borderRadius: 1,
  py: p => (p.notValid ? 4 : 0),
  px: 4,
})`
  background: ${p => (p.notValid ? rgba(p.theme.colors.alertRed, 0.05) : 'transparent')};
  border: ${p => (p.notValid ? `1px dashed ${rgba(p.theme.colors.alertRed, 0.26)}` : 'none')};
`

const Address = styled(Box).attrs({
  bg: p => (p.notValid ? 'transparent' : p.withQRCode ? 'white' : 'lightGrey'),
  borderRadius: 1,
  color: 'dark',
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  mt: 2,
  px: p => (p.notValid ? 0 : 4),
  py: p => (p.notValid ? 0 : 3),
})`
  border: ${p => (p.notValid ? 'none' : `1px dashed ${p.theme.colors.fog}`)};
  cursor: text;
  user-select: text;
`

const Label = styled(Box).attrs({
  alignItems: 'center',
  color: 'graphite',
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  flow: 1,
  horizontal: true,
})``

type Props = {
  account: Account,
  addressVerified: null | boolean,
  amount: null | string,
  t: T,
  withQRCode: boolean,
}

class CurrentAddress extends PureComponent<Props> {
  static defaultProps = {
    addressVerified: null,
    amount: null,
    withQRCode: false,
  }

  render() {
    const { amount, account, t, addressVerified, withQRCode } = this.props

    const notValid = addressVerified === false

    return (
      <Container withQRCode={withQRCode} notValid={notValid}>
        <WrapperAddress notValid={notValid}>
          {withQRCode && (
            <Box mb={4}>
              <QRCode
                size={150}
                data={`bitcoin:${account.address}${amount ? `?amount=${amount}` : ''}`}
              />
            </Box>
          )}
          <Label>
            <Box>{t('currentAddress:label')}</Box>
            <IconInfoCircle size={12} />
          </Label>
          <Address withQRCode={withQRCode} notValid={notValid}>
            {account.address}
          </Address>
        </WrapperAddress>
      </Container>
    )
  }
}

export default translate()(CurrentAddress)
