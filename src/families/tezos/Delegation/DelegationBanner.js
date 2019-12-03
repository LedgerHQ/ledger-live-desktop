// @flow
import React, { useCallback } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'

import styled from 'styled-components'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import Text from 'components/base/Text'

import CoinWallet from 'icons/CoinWallet'
import IconCross from 'icons/Cross'

import { dismissBanner } from 'actions/settings'
import { openModal } from 'reducers/modals'
import { dismissedBannerSelector } from 'reducers/settings'
import { haveUndelegatedAccountsSelector } from 'actions/general'

export const DELEGATION_BANNER = 'DELEGATION_BANNER'

const mapDispatchToProps = { dismissBanner, openModal }

const mapStateToProps = state => ({
  isDismissed: dismissedBannerSelector(state, { bannerKey: DELEGATION_BANNER }),
  hasUndelegated: haveUndelegatedAccountsSelector(state),
})

type Props = {
  isDismissed: boolean,
  hasUndelegated: boolean,
  dismissBanner: string => void,
  openModal: string => void,
}

const IconContainer = styled(Box).attrs(() => ({
  horizontal: true,
  align: 'center',
  p: 4,
}))`
  position: absolute;
  top: 0;
  right: 0;

  cursor: pointer;
`

const LogoContainer = styled(Box).attrs(() => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}))`
  position: absolute;
  top: 10px;
  left: 20px;

  ${IconContainer} {
    width: 100%;
    max-width: 110px;
  }
`

const DelegationBanner = ({ hasUndelegated, isDismissed, dismissBanner, openModal }: Props) => {
  const closeBanner = useCallback(() => dismissBanner(DELEGATION_BANNER), [dismissBanner])

  return hasUndelegated && !isDismissed ? (
    <Card bg="#2C7DF7" style={{ overflow: 'hidden' }} color="palette.primary.contrastText">
      <Box horizontal pr={6} pl={180} py={3} style={{ position: 'relative' }}>
        <IconContainer style={{ zIndex: 10 }} onClick={closeBanner}>
          <IconCross size={16} />
        </IconContainer>
        <Box style={{ zIndex: 10 }} flex={1} justifyContent="space-between">
          <Box mb={24}>
            <Text
              ff="Inter|SemiBold"
              fontSize={6}
              color="palette.primary.contrastText"
              style={{ maxWidth: 320 }}
            >
              <Trans i18nKey="delegation.banner.text" />
            </Text>
          </Box>
          <Box horizontal>
            <Button
              primary
              inverted
              onClick={() => {
                openModal('MODAL_DELEGATE')
              }}
              mr={1}
            >
              <Trans i18nKey="delegation.banner.title" />
            </Button>
            <Button onClick={closeBanner} color="palette.primary.contrastText">
              <Trans i18nKey="common.dismiss" />
            </Button>
          </Box>
        </Box>
        <LogoContainer>
          <CoinWallet size={130} />
        </LogoContainer>
      </Box>
    </Card>
  ) : null
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DelegationBanner)
