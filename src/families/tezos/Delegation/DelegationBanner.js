// @flow
import React from 'react'
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
  color: 'palette.text.shade60',
}))`
  position: absolute;
  top: 0;
  right: 0;

  cursor: pointer;

  &:hover {
    color: ${p => p.theme.colors.palette.text.shade80};
  }

  &:active {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`

const LogoContainer = styled(Box).attrs(() => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}))`
  position: absolute;
  top: 10px;
  right: 25%;

  ${IconContainer} {
    width: 100%;
    max-width: 110px;
  }
`

const DelegationBanner = ({ hasUndelegated, isDismissed, dismissBanner, openModal }: Props) =>
  hasUndelegated && !isDismissed ? (
    <Card>
      <Box horizontal px={6} py={4} style={{ position: 'relative' }}>
        <IconContainer onClick={() => dismissBanner(DELEGATION_BANNER)}>
          <IconCross size={16} />
        </IconContainer>
        <Box flex={1} justifyContent="space-between">
          <Box mb={24}>
            <Text
              ff="Inter|SemiBold"
              fontSize={6}
              color="palette.text.shade100"
              style={{ maxWidth: 320 }}
            >
              <Trans i18nKey="delegation.banner.text" />
            </Text>
          </Box>
          <Box horizontal>
            <Button
              primary
              onClick={() => {
                openModal('MODAL_DELEGATE')
              }}
              mr={1}
            >
              <Trans i18nKey="delegation.title" />
            </Button>
            <Button onClick={() => dismissBanner(DELEGATION_BANNER)}>
              <Trans i18nKey="common.dismiss" />
            </Button>
          </Box>
        </Box>
        <LogoContainer>
          <CoinWallet size={100} />
        </LogoContainer>
      </Box>
    </Card>
  ) : null

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DelegationBanner)
