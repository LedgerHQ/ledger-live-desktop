// @flow
import React, { useCallback } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import Text from 'components/base/Text'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import LinkWithExternalIcon from 'components/base/LinkWithExternalIcon'

import CoinWallet from 'icons/CoinWallet'
import Check from 'icons/CheckFull'

import TrackPage from 'analytics/TrackPage'

import type { StepProps } from '../types'

const Row = styled(Box).attrs(p => ({
  horizontal: true,
  justifyContent: 'flex-start',
  alignItems: 'center',
  color: p.theme.colors.greenPill,
}))`
  margin-bottom: 6px;

  & > :first-child {
    margin-right: 8px;
  }
`

export default ({ transitionTo, t }: StepProps) => {
  const onClick = useCallback(() => {
    transitionTo('account')
  }, [transitionTo])

  return (
    <Box flow={4} mx={4}>
      <TrackPage category="Delegation Flow" name="Step Starter" />
      <Box flow={1} alignItems="center">
        <Box mb={4}>
          <CoinWallet size={120} />
        </Box>
        <Box mb={4}>
          <Text
            ff="Inter|Regular"
            fontSize={14}
            textAlign="center"
            color="palette.text.shade80"
            style={{ lineHeight: 1.57 }}
          >
            <Trans i18nKey="delegation.flow.steps.starter.description" />
          </Text>
        </Box>
        <Box>
          <Row>
            <Check size={16} />
            <Text
              ff="Inter|Bold"
              style={{ lineHeight: 1.57 }}
              color="palette.text.shade100"
              fontSize={14}
            >
              <Trans i18nKey="delegation.flow.steps.starter.bullet.delegate" />
            </Text>
          </Row>
          <Row>
            <Check size={16} />
            <Text
              ff="Inter|Bold"
              style={{ lineHeight: 1.57 }}
              color="palette.text.shade100"
              fontSize={14}
            >
              <Trans i18nKey="delegation.flow.steps.starter.bullet.access" />
            </Text>
          </Row>
          <Row>
            <Check size={16} />
            <Text
              ff="Inter|Bold"
              style={{ lineHeight: 1.57 }}
              color="palette.text.shade100"
              fontSize={14}
            >
              <Trans i18nKey="delegation.flow.steps.starter.bullet.ledger" />
            </Text>
          </Row>
        </Box>
        <Box my={4}>
          <LinkWithExternalIcon
            label={t('delegation.flow.steps.starter.button.howItWorks')}
            onClick={() => {}} // TODO: open url
          />
        </Box>
        <Button onClick={onClick} primary>
          <Trans i18nKey="delegation.flow.steps.starter.button.cta" />
        </Button>
      </Box>
    </Box>
  )
}
