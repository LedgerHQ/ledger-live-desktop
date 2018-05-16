// @flow

import React from 'react'
import { shell } from 'electron'

import styled from 'styled-components'
import Box, { Card } from 'components/base/Box'
import IconUser from 'icons/User'
import IconChevronRight from 'icons/ChevronRight'
import { Title } from '../helperComponents'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, jumpStep, t } = props
  const optionCards = [
    {
      key: 'newDevice',
      icon: <IconUser size={22} />,
      title: t('onboarding:init.newDevice.title'),
      desc: t('onboarding:init.newDevice.desc'),
      onClick: () => nextStep(),
    },
    {
      key: 'restoreDevice',
      icon: <IconUser size={22} />,
      title: t('onboarding:init.restoreDevice.title'),
      desc: t('onboarding:init.restoreDevice.desc'),
      onClick: () => jumpStep('choosePIN'),
    },
    {
      key: 'initializedDevice',
      icon: <IconUser size={22} />,
      title: t('onboarding:init.initializedDevice.title'),
      desc: t('onboarding:init.initializedDevice.desc'),
      onClick: () => jumpStep('choosePIN'),
    },
    {
      key: 'noDevice',
      icon: <IconUser size={22} />,
      title: t('onboarding:init.noDevice.title'),
      desc: t('onboarding:init.noDevice.desc'),
      onClick: () => shell.openExternal('https://www.ledger.fr/'),
    },
  ]

  return (
    <Box sticky alignItems="center" justifyContent="center">
      <Box align="center">
        <Box color="wallet">
          <IconUser size={36} />
        </Box>
        <Box style={{ padding: 20, maxWidth: 650 }}>
          <Title>{t('onboarding:init.title')}</Title>
        </Box>
        <Box flow={5}>{optionCards.map(card => <OptionFlowCard key={card.key} card={card} />)}</Box>
      </Box>
    </Box>
  )
}

type CardType = {
  icon: any,
  desc: any,
  title: any,
  onClick: Function,
}

export function OptionFlowCard({ card }: { card: CardType }) {
  const { icon, desc, title, onClick } = card
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
      <Box justify="center" color="grey" style={{ width: 50 }}>
        {icon}
      </Box>
      <Box ff="Open Sans|Regular" justify="center" fontSize={4} grow>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </Box>
      <Box justify="center" color="grey">
        <IconChevronRight size={22} />
      </Box>
    </Card>
  )
}

export const CardDescription = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'left',
  color: 'smoke',
})``
export const CardTitle = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'left',
})`
  font-weight: 600;
`
