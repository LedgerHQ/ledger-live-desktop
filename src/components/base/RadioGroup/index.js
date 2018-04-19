// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  horizontal: true,
})`
  height: 34px;

  > * + * {
    border-left: 0 !important;
  }

  *:first-child {
    border-top-left-radius: ${p => p.theme.radii[1]}px;
    border-bottom-left-radius: ${p => p.theme.radii[1]}px;
  }

  *:last-child {
    border-top-right-radius: ${p => p.theme.radii[1]}px;
    border-bottom-right-radius: ${p => p.theme.radii[1]}px;
  }
`

const Btn = styled(Box).attrs({
  color: p => (p.isActive ? 'white' : 'grey'),
  bg: p => (p.isActive ? 'wallet' : 'white'),
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 3,
  ff: 'Open Sans|SemiBold',
  px: 3,
})`
  cursor: pointer;
  border: solid 1px ${p => (p.isActive ? p.theme.colors.wallet : p.theme.colors.fog)};
  margin-left: ${p => (p.isActive ? -1 : 0)}px;
`

type Item = {
  label: string,
  key: string,
}

type Props = {
  items: Array<Item>,
  activeKey: string,
  onChange: Item => void,
}

function RadioGroup(props: Props) {
  const { items, activeKey, onChange, ...p } = props
  return (
    <Container {...p}>
      {items.map(item => {
        const isActive = item.key === activeKey
        return (
          <Btn key={item.key} onClick={() => onChange(item)} isActive={isActive}>
            {item.label}
          </Btn>
        )
      })}
    </Container>
  )
}

export default RadioGroup
