// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import styled from 'styled-components'
import { encodeURIScheme } from '@ledgerhq/live-common/lib/currencies'
import type { Account } from '@ledgerhq/live-common/lib/types'

import noop from 'lodash/noop'

import type { T } from 'types/common'

import { rgba } from 'styles/helpers'

import Box from 'components/base/Box'
import CopyToClipboard from 'components/base/CopyToClipboard'
import QRCode from 'components/base/QRCode'

import IconRecheck from 'icons/Recover'
import IconCopy from 'icons/Copy'
import IconShield from 'icons/Shield'

const Container = styled(Box).attrs({
  borderRadius: 1,
  alignItems: 'center',
  bg: p => (p.isAddressVerified === false ? rgba(p.theme.colors.alertRed, 0.02) : 'lightGrey'),
  p: 6,
  pb: 4,
})`
  border: ${p =>
    p.isAddressVerified === false ? `1px dashed ${rgba(p.theme.colors.alertRed, 0.5)}` : 'none'};
`

const Address = styled(Box).attrs({
  bg: 'white',
  borderRadius: 1,
  color: 'dark',
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  mt: 2,
  px: 4,
  py: 3,
  relative: true,
})`
  border: ${p => `1px dashed ${p.theme.colors.fog}`};
  cursor: text;
  user-select: text;
  text-align: center;
  min-width: 320px;
`

const CopyFeedback = styled(Box).attrs({
  sticky: true,
  bg: 'white',
  align: 'center',
  justify: 'center',
})``

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
  px: 2,
})`
  line-height: 1;
  height: 55px;

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
  isAddressVerified?: boolean,
  onCopy: () => void,
  onVerify: () => void,
  t: T,
}

class CurrentAddress extends PureComponent<Props, { copyFeedback: boolean }> {
  static defaultProps = {
    addressVerified: null,
    onCopy: noop,
    onVerify: noop,
  }

  state = {
    copyFeedback: false,
  }

  componentWillUnmount() {
    if (this._timeout) clearTimeout(this._timeout)
    this._isUnmounted = true
  }

  _isUnmounted = false

  renderCopy = copy => {
    const { t } = this.props
    return (
      <FooterButton
        icon={<IconCopy size={16} />}
        label={t('common.copyAddress')}
        onClick={() => {
          this.setState({ copyFeedback: true })
          this._timeout = setTimeout(() => this.setState({ copyFeedback: false }), 1e3)
          copy()
        }}
      />
    )
  }

  _timeout: ?TimeoutID = null

  render() {
    const {
      account: { name: accountName, currency },
      address,
      onCopy,
      onVerify,
      isAddressVerified,
      t,
      ...props
    } = this.props

    const currencyName = currency.name

    const { copyFeedback } = this.state

    return (
      <Container isAddressVerified={isAddressVerified} {...props}>
        <Box mb={4}>
          <QRCode
            size={120}
            data={encodeURIScheme({
              address,
              currency,
            })}
          />
        </Box>
        <Label>
          <Box>
            {accountName ? (
              <Trans i18nKey="currentAddress.for" parent="div">
                {'Address for '}
                <strong>{accountName}</strong>
              </Trans>
            ) : (
              t('currentAddress.title')
            )}
          </Box>
        </Label>
        <Address>
          {copyFeedback && <CopyFeedback>{t('common.addressCopied')}</CopyFeedback>}
          {address}
        </Address>
        <Box horizontal flow={2} mt={2} alignItems="center" style={{ maxWidth: 320 }}>
          <Box color={isAddressVerified === false ? 'alertRed' : 'wallet'}>
            <IconShield height={32} width={28} />
          </Box>
          <Box
            shrink
            fontSize={12}
            color={isAddressVerified === false ? 'alertRed' : 'dark'}
            ff="Open Sans"
          >
            {isAddressVerified === null
              ? t('currentAddress.messageIfUnverified', { currencyName })
              : isAddressVerified
                ? t('currentAddress.messageIfAccepted', { currencyName })
                : t('currentAddress.messageIfSkipped', { currencyName })}
          </Box>
        </Box>
        <Footer>
          {isAddressVerified !== null ? (
            <FooterButton
              icon={<IconRecheck size={16} />}
              label={isAddressVerified === false ? t('common.verify') : t('common.reverify')}
              onClick={onVerify}
            />
          ) : null}
          <CopyToClipboard data={address} render={this.renderCopy} />
        </Footer>
      </Container>
    )
  }
}

export default translate()(CurrentAddress)
