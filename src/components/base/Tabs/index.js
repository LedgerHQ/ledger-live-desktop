// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import type { Element } from 'react'

import Box, { Tabbable } from 'components/base/Box'

const Tab = styled(Tabbable).attrs({
  flex: 1,
  pb: 2,
  align: 'center',
  justify: 'center',
  fontSize: 1,
})`
  border-bottom: 2px solid transparent;
  border-bottom-color: ${p => (p.isActive ? p.theme.colors.blue : '')};
  color: ${p => (p.isActive ? p.theme.colors.blue : p.theme.colors.steel)};
  margin-bottom: -1px;
  outline: none;
  cursor: ${p => (p.isActive ? 'default' : 'pointer')};
  max-width: 200px;
`

type Item = {
  key: string | number,
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
    <Box horizontal borderBottom borderWidth={1} borderColor="argile">
      {items.map((item, i) => (
        <Tab key={item.key} isActive={index === i} onClick={() => onTabClick(i)}>
          {item.title}
        </Tab>
      ))}
    </Box>
    {items[index] && items[index].render()}
  </Fragment>
)

export default Tabs
