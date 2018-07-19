// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { colors } from 'styles/theme'

import styled from 'styled-components'
import { flowType } from 'reducers/onboarding'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import TrackPage from 'analytics/TrackPage'
import IconPlus from 'icons/Plus'
import IconRecover from 'icons/Recover'
import IconCheck from 'icons/Check'
import IconExternalLink from 'icons/ExternalLink'
import IconChevronRight from 'icons/ChevronRight'
import { i } from 'helpers/staticPath'
import { Title, LiveLogo } from '../helperComponents'

import type { StepProps } from '..'

const mapDispatchToProps = { flowType }

class Init extends PureComponent<StepProps, *> {
  render() {
    const { t, flowType, jumpStep } = this.props

    const optionCards = [
      {
        key: 'newDevice',
        icon: <IconPlus size={20} />,
        title: t('onboarding:init.newDevice.title'),
        onClick: () => {
          jumpStep('selectDevice')
          flowType('newDevice')
        },
      },
      {
        key: 'restoreDevice',
        icon: <IconRecover size={20} />,
        title: t('onboarding:init.restoreDevice.title'),
        onClick: () => {
          jumpStep('selectDevice')
          flowType('restoreDevice')
        },
      },
      {
        key: 'initializedDevice',
        icon: <IconCheck size={20} />,
        title: t('onboarding:init.initializedDevice.title'),
        onClick: () => {
          jumpStep('selectDevice')
          flowType('initializedDevice')
        },
      },
      {
        key: 'noDevice',
        icon: <IconExternalLink size={20} />,
        title: t('onboarding:noDevice.title'),
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
          <LiveLogo
            style={{ width: 64, height: 64 }}
            icon={<img src={i('ledgerlive-logo.svg')} alt="" width={40} height={40} />}
          />
          <Box m={5} style={{ maxWidth: 480 }}>
            <Title>{t('onboarding:init.title')}</Title>
          </Box>
          <Box pt={4} flow={4}>
            {optionCards.map(card => <OptionFlowCard key={card.key} card={card} />)}
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
    <InitCardContainer onClick={onClick}>
      <Box justify="center" style={{ color: colors.wallet }}>
        <InitIconContainer justify="center">{icon}</InitIconContainer>
      </Box>
      <Box justify="center" grow>
        <CardTitle>{title}</CardTitle>
      </Box>
      <Box justify="center" mx={1} my={4}>
        <IconChevronRight style={{ color: colors.grey }} size={16} />
      </Box>
    </InitCardContainer>
  )
}

const InitCardContainer = styled(Box).attrs({
  p: 3,
  horizontal: true,
  borderRadius: '4px',
})`
  border: 1px solid ${p => p.theme.colors.fog};
  width: 530px;
  height: 70px;
  transition: all ease-in-out 0.2s;
  &:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  }
`

export const CardTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'left',
})``

const InitIconContainer = styled(Box).attrs({
  ml: 3,
  mr: 4,
})`
  text-align: -webkit-center;
`
