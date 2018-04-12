// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import type { Element } from 'react'

import Box, { Tabbable } from 'components/base/Box'

const WrapperTab = styled(Box).attrs({
  horizontal: true,
})`
  border-bottom: 1px solid ${p => p.theme.colors.fog};
`

const Tab = styled(Tabbable).attrs({
  flex: 1,
  pb: 2,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 3,
})`
  border-bottom: 2px solid transparent;
  border-bottom-color: ${p => (p.isActive ? p.theme.colors.wallet : '')};
  color: ${p =>
    p.isActive
      ? p.theme.colors.wallet
      : p.isDisabled
        ? p.theme.colors.grey
        : p.theme.colors.graphite};
  margin-bottom: -1px;
  outline: none;
  cursor: ${p => (p.isActive ? 'default' : p.isDisabled ? 'not-allowed' : 'pointer')};
  max-width: 200px;
`

type Item = {
  key: string | number,
  isDisabled?: boolean,
  title: string | Element<any>,
  render: () => Element<any>,
}

type Props = {
  items: Array<Item>,
  index: number,
  onTabClick: number => void,
}

const Tabs = ({ items, index, onTabClick }: Props) => (
  <Fragment>
    <WrapperTab>
      {items.map((item, i) => (
        <Tab
          key={item.key}
          isDisabled={item.isDisabled}
          isActive={index === i}
          onClick={item.isDisabled ? void 0 : () => onTabClick(i)}
        >
          {item.title}
        </Tab>
      ))}
    </WrapperTab>
    {items[index] && items[index].render()}
  </Fragment>
)

export default Tabs
