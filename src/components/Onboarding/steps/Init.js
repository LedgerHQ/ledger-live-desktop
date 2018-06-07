// @flow

import React, { PureComponent } from 'react'
import { shell } from 'electron'
import { connect } from 'react-redux'
import { colors } from 'styles/theme'

import styled from 'styled-components'
import { flowType } from 'reducers/onboarding'
import Box, { Card } from 'components/base/Box'
import IconUser from 'icons/User'
import IconPlus from 'icons/Plus'
import IconRecover from 'icons/Recover'
import IconCheck from 'icons/Check'
import IconExternalLink from 'icons/ExternalLink'
import IconChevronRight from 'icons/ChevronRight'
import { Title } from '../helperComponents'

import type { StepProps } from '..'

const mapDispatchToProps = { flowType }

class Init extends PureComponent<StepProps, *> {
  render() {
    const { nextStep, t } = this.props

    const optionCards = [
      {
        key: 'newDevice',
        icon: <IconPlus size={20} />,
        title: t('onboarding:init.newDevice.title'),
        onClick: () => {
          nextStep()
          this.props.flowType('newDevice')
        },
      },
      {
        key: 'restoreDevice',
        icon: <IconRecover size={20} />,
        title: t('onboarding:init.restoreDevice.title'),
        onClick: () => {
          nextStep()
          this.props.flowType('restoreDevice')
        },
      },
      {
        key: 'initializedDevice',
        icon: <IconCheck size={20} />,
        title: t('onboarding:init.initializedDevice.title'),
        onClick: () => {
          nextStep()
          this.props.flowType('initializedDevice')
        },
      },
      {
        key: 'noDevice',
        icon: <IconExternalLink size={20} />,
        title: t('onboarding:init.noDevice.title'),
        onClick: () => {
          shell.openExternal('https://www.ledger.fr/')
          this.props.flowType('noDevice')
        },
      },
    ]

    return (
      <Box sticky pt={130}>
        <Box align="center" justifyContent="center">
          <Box color="wallet">
            <IconUser size={36} />
          </Box>
          <Box m={5} style={{ maxWidth: 480 }}>
            <Title>{t('onboarding:init.title')}</Title>
          </Box>
          <Box pt={4} flow={4}>
            {optionCards.map(card => <OptionFlowCard key={card.key} card={card} />)}
          </Box>
        </Box>
      </Box>
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
