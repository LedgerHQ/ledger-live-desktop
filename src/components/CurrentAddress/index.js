// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import styled from 'styled-components'

import noop from 'lodash/noop'

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
    background-color: rgba(100, 144, 241, 0.1);
    color: ${p => p.theme.colors.dark};

    svg {
      color: ${p => p.theme.colors.wallet};
    }
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
  <Box grow alignItems="center" justifyContent="center">
    <FooterButtonWrapper onClick={onClick}>
      {icon}
      <Box fontSize={3} ff="Museo Sans|Bold" mt={1}>
        {label}
      </Box>
    </FooterButtonWrapper>
  </Box>
)

type Props = {
  accountName?: string,
  address: string,
  addressVerified?: boolean,
  amount?: string,
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
      accountName,
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
            <QRCode size={120} data={`bitcoin:${address}${amount ? `?amount=${amount}` : ''}`} />
          </Box>
        )}
        <Label>
          <Box>
            {accountName ? (
              <Trans i18nKey="currentAddress:labelFrom" parent="div">
                {'Address from '}
                <strong>{accountName}</strong>
              </Trans>
            ) : (
              t('currentAddress:label')
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
              data={address}
              render={copy => (
                <FooterButton icon={<IconCopy size={16} />} label="Copy" onClick={copy} />
              )}
            />
            <Print
              data={{ address, amount, accountName }}
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
