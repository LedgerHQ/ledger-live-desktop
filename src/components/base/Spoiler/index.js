// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import IconChevronRight from 'icons/ChevronRight'

type Props = {
  children: any,
  title: string,
}

type State = {
  isOpened: boolean,
}

const Title = styled(Text).attrs({
  ff: p => (p.ff ? p.ff : 'Museo Sans|Bold'),
  fontSize: p => (p.fontSize ? p.fontSize : 2),
  color: p => (p.color ? p.color : 'dark'),
  tabIndex: 0,
})`
  text-transform: ${p => (!p.textTransform ? 'auto' : 'uppercase')};
  letter-spacing: 1px;
  cursor: pointer;
  outline: none;
`

const IconContainer = styled(Box)`
  transform: rotate(${p => (p.isOpened ? '90' : '0')}deg);
  transition: 150ms linear transform;
`

class Spoiler extends PureComponent<Props, State> {
  state = {
    isOpened: false,
  }

  toggle = () => this.setState({ isOpened: !this.state.isOpened })

  render() {
    const { title, children, ...p } = this.props
    const { isOpened } = this.state
    return (
      <Fragment>
        <Box horizontal flow={1} color="dark" align="center" {...p}>
          <IconContainer isOpened={isOpened}>
            <IconChevronRight size={12} />
          </IconContainer>
          <Title {...p} onClick={this.toggle}>
            {title}
          </Title>
        </Box>
        {isOpened && children}
      </Fragment>
    )
  }
}

export default Spoiler
