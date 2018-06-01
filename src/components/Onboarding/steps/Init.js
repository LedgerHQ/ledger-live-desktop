// @flow

import React from 'react'
import { shell } from 'electron'
import { colors } from 'styles/theme'
import { rgba } from 'styles/helpers'

import styled from 'styled-components'
import Box, { Card } from 'components/base/Box'
import IconUser from 'icons/User'
import IconAdd from 'icons/Plus'
import IconRecover from 'icons/Recover'
import IconCheck from 'icons/Check'
import IconExternalLink from 'icons/ExternalLink'
import IconChevronRight from 'icons/ChevronRight'
import { Title } from '../helperComponents'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, jumpStep, t } = props
  const optionCards = [
    {
      key: 'newDevice',
      icon: <IconAdd size={16} />,
      title: t('onboarding:init.newDevice.title'),
      onClick: () => nextStep(),
    },
    {
      key: 'restoreDevice',
      icon: <IconRecover size={16} />,
      title: t('onboarding:init.restoreDevice.title'),
      onClick: () => jumpStep('choosePIN'),
    },
    {
      key: 'initializedDevice',
      icon: <IconCheck size={16} />,
      title: t('onboarding:init.initializedDevice.title'),
      onClick: () => jumpStep('choosePIN'),
    },
    {
      key: 'noDevice',
      icon: <IconExternalLink size={16} />,
      title: t('onboarding:init.noDevice.title'),
      onClick: () => shell.openExternal('https://www.ledger.fr/'),
    },
  ]

  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center">
        <Box color="wallet">
          <IconUser size={36} />
        </Box>
        <Box p={4} style={{ maxWidth: 550 }} textAlign="center">
          <Title>{t('onboarding:init.title')}</Title>
        </Box>
        <Box mt={5} flow={5}>
          {optionCards.map(card => <OptionFlowCard key={card.key} card={card} />)}
        </Box>
      </Box>
    </Box>
  )
}

type CardType = {
  icon: any,
  title: any,
  onClick: Function,
}

export function OptionFlowCard({ card }: { card: CardType }) {
  const { icon, title, onClick } = card
  return (
    <Card
      horizontal
      p={5}
      style={{
        cursor: 'pointer',
        border: 'solid 1px #d8d8d8',
        minWidth: '533px',
        maxHeight: '80px',
      }}
      onClick={onClick}
    >
      <Box justify="center" style={{ color: colors.wallet }}>
        <Container mr={4} justify="center">
          {icon}
        </Container>
      </Box>
      <Box ff="Open Sans|Regular" justify="center" fontSize={4} grow>
        <CardTitle>{title}</CardTitle>
      </Box>
      <Box justify="center" color="grey">
        <IconChevronRight size={22} />
      </Box>
    </Card>
  )
}

export const CardTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  textAlign: 'left',
})``

const Container = styled(Box).attrs({})`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(100, 144, 241, 0.1);
  text-align: -webkit-center;
`
