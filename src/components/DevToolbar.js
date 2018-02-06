// @flow

import React, { PureComponent } from 'react'
import reduce from 'lodash/fp/reduce'
import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import sortBy from 'lodash/fp/sortBy'
import styled from 'styled-components'
import color from 'color'

import Box from 'components/base/Box'

import theme from 'styles/theme'

type HslColor = {
  color: Array<number>,
}

type ColorType = {
  name: string,
  val: string,
  color: {
    isDark: () => boolean,
    hsl: () => HslColor,
  },
}

const transform = flow(
  reduce.convert({ cap: false })((acc, cur, key) => {
    const c = color(cur)
    return [
      ...acc,
      {
        name: key,
        val: cur,
        color: c,
        isDark: c.isDark(),
      },
    ]
  }, []),
  filter(el => el.name !== 'transparent'),
  sortBy(el => el.color.hsl().color[2]),
)

const colors: Array<ColorType> = transform(theme.colors)

const Container = styled(Box).attrs({
  bg: 'night',
  p: 1,
  color: 'white',
  fontSize: 0,
})`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1;
  border-top-left-radius: 3px;
  transition: ease-in-out transform 300ms;
  transform: translate3d(0, ${p => (p.isOpened ? '0' : '100%')}, 0);
`

const Handle = styled(Box).attrs({
  bg: 'night',
})`
  cursor: pointer;
  padding: 3px 8px 3px 8px;
  position: absolute;
  bottom: 100%;
  right: 5px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`

const Colors = styled(Box).attrs({
  horizontal: true,
  align: 'flex-start',
})`
  flex-wrap: wrap;
  width: 416px;
`

const Cl = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  p: 2,
})`
  border: 2px solid white;
  margin: 2px;
  width: 100px;
  user-select: text;
  cursor: text;
`

const Color = ({ color }: { color: ColorType }) => (
  <Cl bg={color.val} color={color.isDark ? 'white' : 'night'}>
    {color.name}
  </Cl>
)

type State = {
  isOpened: boolean,
}

class DevToolbar extends PureComponent<any, State> {
  state = {
    isOpened: false,
  }

  handleToggle = () => this.setState({ isOpened: !this.state.isOpened })

  render() {
    const { isOpened } = this.state
    return (
      <Container isOpened={isOpened}>
        <Handle onClick={this.handleToggle}>{'DEV'}</Handle>
        <Colors>{colors.map(color => <Color key={color.name} color={color} />)}</Colors>
      </Container>
    )
  }
}

export default DevToolbar
