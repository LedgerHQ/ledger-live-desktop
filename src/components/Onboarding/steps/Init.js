// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import styled from 'styled-components'
import { flowType } from 'reducers/onboarding'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import LedgerLiveLogo from 'components/base/LedgerLiveLogo'
import TrackPage from 'analytics/TrackPage'
import IconPlus from 'icons/Plus'
import IconRecover from 'icons/Recover'
import IconCheck from 'icons/Check'
import IconExternalLink from 'icons/ExternalLink'
import IconChevronRight from 'icons/ChevronRight'
import { i } from 'helpers/staticPath'
import { Title } from '../helperComponents'

import type { StepProps } from '..'

const mapDispatchToProps = { flowType }

class Init extends PureComponent<StepProps, *> {
  render() {
    const { t, flowType, jumpStep } = this.props

    const optionCards = [
      {
        key: 'newDevice',
        icon: <IconPlus size={20} />,
        title: t('onboarding.init.newDevice.title'),
        onClick: () => {
          jumpStep('selectDevice')
          flowType('newDevice')
        },
      },
      {
        key: 'restoreDevice',
        icon: <IconRecover size={20} />,
        title: t('onboarding.init.restoreDevice.title'),
        onClick: () => {
          jumpStep('selectDevice')
          flowType('restoreDevice')
        },
      },
      {
        key: 'initializedDevice',
        icon: <IconCheck size={20} />,
        title: t('onboarding.init.initializedDevice.title'),
        onClick: () => {
          jumpStep('selectDevice')
          flowType('initializedDevice')
        },
      },
      {
        key: 'noDevice',
        icon: <IconExternalLink size={20} />,
        title: t('onboarding.noDevice.title'),
        onClick: () => {
          jumpStep('noDevice')
          flowType('noDevice')
        },
      },
    ]

    return (
      <GrowScroll full justifyContent="center" py={7}>
        <TrackPage category="Onboarding" name="Init" />
        <Box align="center">
          <LedgerLiveLogo
            width="64px"
            height="64px"
            icon={
              <img src={i('ledgerlive-logo.svg')} alt="" draggable="false" width={40} height={40} />
            }
          />
          <Box m={5} style={{ maxWidth: 480 }}>
            <Title>{t('onboarding.init.title')}</Title>
          </Box>
          <Box pt={4} flow={4}>
            {optionCards.map(card => (
              <OptionFlowCard key={card.key} card={card} />
            ))}
          </Box>
        </Box>
      </GrowScroll>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Init)

type CardType = {
  icon: any,
  title: any,
  onClick: Function,
}

export function OptionFlowCard({ card }: { card: CardType }) {
  const { icon, title, onClick } = card
  return (
    <InitCardContainer onClick={onClick} color="palette.text.shade100">
      <Box justify="center" color={'palette.primary.main'}>
        <InitIconContainer justify="center">{icon}</InitIconContainer>
      </Box>
      <Box justify="center" grow>
        <CardTitle>{title}</CardTitle>
      </Box>
      <Box justify="center" mx={1} my={4}>
        <IconChevronRight size={16} />
      </Box>
    </InitCardContainer>
  )
}

const InitCardContainer = styled(Box).attrs(() => ({
  p: 3,
  horizontal: true,
  borderRadius: '4px',
}))`
  border: 1px solid ${p => p.theme.colors.palette.divider};
  width: 530px;
  height: 70px;
  transition: all ease-in-out 0.2s;
  &:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  }
`

export const CardTitle = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 4,
  textAlign: 'left',
}))``

const InitIconContainer = styled(Box).attrs(() => ({
  ml: 3,
  mr: 4,
}))`
  text-align: -webkit-center;
`
