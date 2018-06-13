// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import styled from 'styled-components'
import { encodeURIScheme } from '@ledgerhq/live-common/lib/helpers/currencies'
import type { Account } from '@ledgerhq/live-common/lib/types'

import noop from 'lodash/noop'

import type { T } from 'types/common'

import { rgba } from 'styles/helpers'

import Box from 'components/base/Box'
import CopyToClipboard from 'components/base/CopyToClipboard'
import QRCode from 'components/base/QRCode'

import IconCheck from 'icons/Check'
import IconCopy from 'icons/Copy'
import IconInfoCircle from 'icons/InfoCircle'
import IconShield from 'icons/Shield'

const Container = styled(Box).attrs({
  borderRadius: 1,
  alignItems: 'center',
  bg: p =>
    p.withQRCode ? (p.notValid ? rgba(p.theme.colors.alertRed, 0.02) : 'lightGrey') : 'transparent',
  py: 4,
  px: 7,
})`
  border: ${p => (p.notValid ? `1px dashed ${rgba(p.theme.colors.alertRed, 0.5)}` : 'none')};
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
})`
  strong {
    color: ${p => p.theme.colors.dark};
    font-weight: 600;
    border-bottom: 1px dashed ${p => p.theme.colors.dark};
  }
`

const Footer = styled(Box).attrs({
  justify: 'center',
  flow: 4,
  horizontal: true,
  mt: 4,
})`
  text-transform: uppercase;
  width: 100%;
`

const FooterButtonWrapper = styled(Box).attrs({
  color: 'grey',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 1,
})`
  cursor: pointer;
  height: 55px;
  width: 55px;

  &:hover {
    background-color: ${p => rgba(p.theme.colors.wallet, 0.1)};
    color: ${p => p.theme.colors.dark};

    svg {
      color: ${p => p.theme.colors.wallet};
    }
  }

  &:active {
    background-color: ${p => rgba(p.theme.colors.wallet, 0.15)};
  }
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
  <Box alignItems="center" justifyContent="center">
    <FooterButtonWrapper onClick={onClick}>
      {icon}
      <Box fontSize={3} ff="Museo Sans|Bold" mt={1}>
        {label}
      </Box>
    </FooterButtonWrapper>
  </Box>
)

type Props = {
  account: Account,
  address: string,
  amount?: number,
  addressVerified?: boolean,
  onCopy: () => void,
  onPrint: () => void,
  onShare: () => void,
  onVerify: () => void,
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
      account: { name: accountName, currency },
      address,
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
        {withQRCode && (
          <Box mb={4}>
            <QRCode
              size={120}
              data={encodeURIScheme({
                address,
                amount,
                currency,
              })}
            />
          </Box>
        )}
        <Label>
          <Box>
            {accountName ? (
              <Trans i18nKey="app:currentAddress.for" parent="div">
                Address for <strong>{accountName}</strong>
              </Trans>
            ) : (
              t('app:currentAddress.title')
            )}
          </Box>
          <IconInfoCircle size={12} />
        </Label>
        <Address withQRCode={withQRCode} notValid={notValid}>
          {address}
        </Address>
        {withBadge && (
          <Box horizontal flow={2} mt={2} alignItems="center">
            <Box color={notValid ? 'alertRed' : 'wallet'}>
              <IconShield height={32} width={28} />
            </Box>
            <Box shrink fontSize={12} color={notValid ? 'alertRed' : 'dark'} ff="Open Sans">
              {t('app:currentAddress.message')}
            </Box>
          </Box>
        )}
        {withFooter && (
          <Footer>
            <FooterButton icon={<IconCheck size={16} />} label="Verify" onClick={onVerify} />
            <CopyToClipboard
              data={address}
              render={copy => (
                <FooterButton icon={<IconCopy size={16} />} label="Copy" onClick={copy} />
              )}
            />
          </Footer>
        )}
      </Container>
    )
  }
}

export default translate()(CurrentAddress)
