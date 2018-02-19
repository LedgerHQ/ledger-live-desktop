// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'
import Box, { Tabbable } from 'components/base/Box'
import BoldToggle from 'components/base/BoldToggle'

type Item = {
  key: string,
  label: string,
}

type Props = {
  items: Array<Item>,
  activeKey: string,
  onChange: Item => void,
}

const Container = styled(Box).attrs({
  horizontal: true,
})``

const Pill = styled(Tabbable).attrs({
  ff: p => (p.isActive ? 'Open Sans|SemiBold' : 'Open Sans'),
  color: p => (p.isActive ? 'dodgerBlue' : 'warmGrey'),
  bg: p => (p.isActive ? rgba(p.theme.colors.dodgerBlue, 0.1) : ''),
  px: 3,
  fontSize: 4,
  borderRadius: 1,
  alignItems: 'center',
  justifyContent: 'center',
})`
  height: 28px;
  outline: none;
  cursor: ${p => (p.isActive ? 'default' : 'pointer')};

  &:focus {
    color: ${p => p.theme.colors.dodgerBlue};
    background-color: ${p => (p.isActive ? '' : rgba(p.theme.colors.black, 0.02))};
  }
`

function Pills(props: Props) {
  const { items, activeKey, onChange, ...p } = props
  return (
    <Container flow={1} {...p}>
      {items.map(item => {
        const isActive = item.key === activeKey
        return (
          <Pill isActive={isActive} onClick={() => onChange(item)} key={item.key}>
            <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
          </Pill>
        )
      })}
    </Container>
  )
}

export default Pills
