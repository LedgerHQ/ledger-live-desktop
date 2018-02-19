// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import {
  alignItems,
  borderRadius,
  boxShadow,
  color,
  flex,
  fontSize,
  justifyContent,
  space,
} from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

import Text from 'components/base/Text'

const Box = styled.div`
  ${alignItems};
  ${borderRadius};
  ${boxShadow};
  ${color};
  ${flex};
  ${fontFamily};
  ${fontSize};
  ${justifyContent};
  ${space};

  display: flex;
  flex-shrink: ${p => (p.noShrink === true ? '0' : p.shrink === true ? '1' : '')};
  flex-grow: ${p => (p.grow === true ? '1' : p.grow || '')};
  flex-direction: ${p => (p.horizontal ? 'row' : 'column')};

  overflow-y: ${p => (p.scroll === true ? 'auto' : '')};
  position: ${p => (p.relative ? 'relative' : p.sticky ? 'absolute' : '')};

  ${p =>
    p.sticky &&
    `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    `};

  > * + * {
    margin-top: ${p => (!p.horizontal && p.flow ? `${p.theme.space[p.flow]}px` : '')};
    margin-left: ${p => (p.horizontal && p.flow ? `${p.theme.space[p.flow]}px` : '')};
  }
`

const RawCard = styled(Box).attrs({ bg: 'white', p: 3, boxShadow: 0, borderRadius: 1 })``

export const Card = ({ title, ...props }: { title?: string }) => {
  if (title) {
    return (
      <Box flow={4}>
        <Text color="dark" ff="Museo Sans" fontSize={6}>
          {title}
        </Text>
        <RawCard {...props} />
      </Box>
    )
  }
  return <RawCard {...props} />
}

Card.defaultProps = {
  title: undefined,
}

type TabbableState = {
  isFocused: boolean,
}

export class Tabbable extends PureComponent<any, TabbableState> {
  state = {
    isFocused: false,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  }

  handleFocus = () => this.setState({ isFocused: true })
  handleBlur = () => this.setState({ isFocused: false })

  handleKeydown = (e: SyntheticKeyboardEvent<any>) => {
    if ((e.which === 13 || e.which === 32) && this.state.isFocused && this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render() {
    return <Box tabIndex={0} onFocus={this.handleFocus} onBlur={this.handleBlur} {...this.props} />
  }
}

export default Box
