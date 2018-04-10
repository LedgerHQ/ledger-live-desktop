// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import noop from 'lodash/noop'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { T } from 'types/common'

import { rgba } from 'styles/helpers'

import Box from 'components/base/Box'
import CopyToClipboard from 'components/base/CopyToClipboard'
import Print from 'components/base/Print'
import QRCode from 'components/base/QRCode'

import IconCheck from 'icons/Check'
import IconCopy from 'icons/Copy'
import IconInfoCircle from 'icons/InfoCircle'
import IconPrint from 'icons/Print'
import IconShare from 'icons/Share'
import IconShield from 'icons/Shield'

const Container = styled(Box).attrs({
  borderRadius: 1,
  alignItems: 'center',
  bg: p => (p.withQRCode ? 'lightGrey' : 'transparent'),
  py: 5,
  px: 7,
})``

const WrapperAddress = styled(Box).attrs({
  alignItems: 'center',
  borderRadius: 1,
  py: p => (p.notValid ? 4 : 0),
  px: 4,
})`
  background: ${p => (p.notValid ? rgba(p.theme.colors.alertRed, 0.05) : 'transparent')};
  border: ${p => (p.notValid ? `1px dashed ${rgba(p.theme.colors.alertRed, 0.26)}` : 'none')};
  width: 100%;
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

const Footer = styled(Box).attrs({
  horizontal: true,
  mt: 5,
})`
  text-transform: uppercase;
  width: 100%;
`

const FooterButtonWrapper = styled(Box).attrs({
  color: 'grey',
  alignItems: 'center',
  justifyContent: 'center',
  grow: true,
})`
  cursor: pointer;
`

const FooterButton = ({
  icon,
  label,
  onClick,
}: {
  icon: any,
  label: string,
  onClick: Function,
}) => (
  <FooterButtonWrapper onClick={onClick}>
    {icon}
    <Box fontSize={3} ff="Museo Sans|Bold" mt={1}>
      {label}
    </Box>
  </FooterButtonWrapper>
)

type Props = {
  account: Account,
  addressVerified: null | boolean,
  amount: null | string,
  onCopy: Function,
  onPrint: Function,
  onShare: Function,
  onVerify: Function,
  t: T,
  withBadge: boolean,
  withFooter: boolean,
  withQRCode: boolean,
  withVerify: boolean,
}

class CurrentAddress extends PureComponent<Props> {
  static defaultProps = {
    addressVerified: null,
    amount: null,
    onCopy: noop,
    onPrint: noop,
    onShare: noop,
    onVerify: noop,
    withBadge: false,
    withFooter: false,
    withQRCode: false,
    withVerify: false,
  }

  render() {
    const {
      account,
      addressVerified,
      amount,
      onCopy,
      onPrint,
      onShare,
      onVerify,
      t,
      withBadge,
      withFooter,
      withQRCode,
      withVerify,
      ...props
    } = this.props

    const notValid = addressVerified === false

    return (
      <Container withQRCode={withQRCode} notValid={notValid} {...props}>
        <WrapperAddress notValid={notValid} grow>
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
        {withBadge && (
          <Box horizontal flow={2} mt={2} alignItems="center">
            <Box color={notValid ? 'alertRed' : 'wallet'}>
              <IconShield height={32} width={28} />
            </Box>
            <Box shrink fontSize={12} color={notValid ? 'alertRed' : 'dark'} ff="Open Sans">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam blandit velit egestas leo
              tincidunt
            </Box>
          </Box>
        )}
        {withFooter && (
          <Footer>
            {withVerify && (
              <FooterButton icon={<IconCheck size={16} />} label="Verify" onClick={onVerify} />
            )}
            <CopyToClipboard
              data={account.address}
              render={copy => (
                <FooterButton icon={<IconCopy size={16} />} label="Copy" onClick={copy} />
              )}
            />
            <Print
              data={{ account, amount }}
              render={(print, isLoading) => (
                <FooterButton
                  icon={<IconPrint size={16} />}
                  label={isLoading ? '...' : 'Print'}
                  onClick={print}
                />
              )}
            />
            <FooterButton icon={<IconShare size={16} />} label="Share" onClick={onShare} />
          </Footer>
        )}
      </Container>
    )
  }
}

export default translate()(CurrentAddress)
