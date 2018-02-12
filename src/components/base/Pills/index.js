// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'
import Box, { Tabbable } from 'components/base/Box'

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
  color: p => (p.isActive ? 'dodgerBlue' : 'warmGrey'),
  bg: p => (p.isActive ? rgba(p.theme.colors.dodgerBlue, 0.1) : ''),
  px: 2,
  fontSize: 0,
  align: 'center',
  justify: 'center',
})`
  height: 30px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;

  &:focus {
    color: ${p => p.theme.colors.dodgerBlue};
  }
`

function Pills(props: Props) {
  const { items, activeKey, onChange, ...p } = props
  return (
    <Container {...p}>
      {items.map(item => (
        <Pill isActive={item.key === activeKey} onClick={() => onChange(item)} key={item.key}>
          {item.label}
        </Pill>
      ))}
    </Container>
  )
}

export default Pills
