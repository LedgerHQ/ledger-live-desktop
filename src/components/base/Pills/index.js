// @flow

import React from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'
import Box, { Tabbable } from 'components/base/Box'

type Item = {
  label: React$Node,
  key: string,
  value?: any,
}

type Props = {
  items: Array<Item>,
  activeKey: string,
  onChange: Item => void,
  bordered?: boolean,
}

const Container = styled(Box).attrs(() => ({
  horizontal: true,
}))``

const Pill = styled(Tabbable).attrs(p => ({
  ff: p.bordered ? 'Inter|Bold' : 'Inter|SemiBold',
  color: p.isActive ? 'wallet' : 'palette.text.shade60',
  bg: p.isActive ? rgba(p.theme.colors.wallet, 0.1) : '',
  px: p.bordered ? 2 : 3,
  fontSize: 3,
  borderRadius: 1,
  alignItems: 'center',
  justifyContent: 'center',
}))`
  border: ${p => (p.bordered ? '1px solid' : 'none')};
  border-color: ${p => (p.isActive ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
  height: 28px;
  outline: none;
  cursor: ${p => (p.isActive ? 'default' : 'pointer')};
  width: ${p => (p.bordered ? '40px' : '')};

  &:hover {
    color: ${p => (p.isActive ? p.theme.colors.wallet : p.theme.colors.palette.text.shade100)};
  }

  &:focus {
    color: ${p => p.theme.colors.wallet};
    background-color: ${p => (p.isActive ? '' : rgba(p.theme.colors.palette.text.shade100, 0.02))};
  }
`

function Pills(props: Props) {
  const { items, activeKey, onChange, bordered, ...p } = props
  return (
    <Container flow={1} {...p}>
      {items.map(item => {
        const isActive = item.key === activeKey
        return (
          <Pill
            isActive={isActive}
            onClick={() => onChange(item)}
            key={item.key}
            bordered={bordered}
            data-e2e={`tabs_${item.key}`}
          >
            {item.label}
          </Pill>
        )
      })}
    </Container>
  )
}

export default Pills
