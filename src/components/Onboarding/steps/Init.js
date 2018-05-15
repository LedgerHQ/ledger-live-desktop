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
  const { nextStep, jumpStep } = props
  const optionCards = [
    {
      key: 'newDevice',
      icon: <IconUser size={22} />,
      title: 'Initialize your new Ledger device',
      desc: 'Please replace it with the final wording once it’s done.',
      onClick: () => nextStep(),
    },
    {
      key: 'restoreDevice',
      icon: <IconUser size={22} />,
      title: 'Restore a Ledger device',
      desc: 'Please replace it with the final wording once it’s done.',
      onClick: () => jumpStep('choosePIN'),
    },
    {
      key: 'initializedDevice',
      icon: <IconUser size={22} />,
      title: 'I have already initialized my device',
      desc: 'Please replace it with the final wording once it’s done.',
      onClick: () => jumpStep('choosePIN'),
    },
    {
      key: 'noDevice',
      icon: <IconUser size={22} />,
      title: 'Do not have a Ledger device yet? Buy one',
      desc: 'Please replace it with the final wording once it’s done.',
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
          <Title>
            Welcome to Ledger Live, the computer companion app to your Ledger device. Please select
            one of the options below:
          </Title>
        </Box>
        <Box flow={5}>{optionCards.map(card => <OptionFlowCard key={card.key} card={card} />)}</Box>
      </Box>
    </Box>
  )
}

type CardType = {
  icon: any,
  desc: string,
  title: string,
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
