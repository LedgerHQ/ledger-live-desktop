// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const Wrapper = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  color: p => (p.isActive ? 'wallet' : 'fog'),
})`
  width: 40px;
  flex-shrink: 0;
  text-align: center;
  font-size: 9px;
`

const Number = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  color: p => (p.isActive ? 'white' : 'fog'),
  bg: p => (p.isActive ? 'wallet' : 'pearl'),
})`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 9px;
  box-shadow: ${p => `0 0 0 ${p.isActive ? 4 : 0}px ${p.theme.colors.lightGrey}`};
  transition: all ease-in-out 0.1s ${p => (p.isActive ? 0.4 : 0)}s;
`

const Bar = styled.div`
  height: 2px;
  background: ${p => p.theme.colors.pearl};
  flex-grow: 1;
  position: relative;

  &:after {
    background: ${p => p.theme.colors.pearl};
    content: '';
    display: block;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    background: ${p => p.theme.colors.wallet};
    transition: transform ease-in-out 0.4s;
    transform-origin: center left;
    transform: scaleX(${p => (p.isActive ? 1 : 0)});
  }
`

const Label = styled(Box)`
  position: absolute;
  margin-top: 30px;
  transition: color ease-in-out 0.1s ${p => (p.isActive ? 0.4 : 0)}s;
`

type Props = {
  number: number,
  isActive: boolean,
  isFirst: boolean,
  children: any,
}

function Step(props: Props) {
  const { number, isActive, isFirst, children } = props
  return (
    <Fragment>
      {!isFirst && <Bar isActive={isActive} />}
      <Wrapper isActive={isActive}>
        <Number isActive={isActive}>{number}</Number>
        <Label isActive={isActive}>{children}</Label>
      </Wrapper>
    </Fragment>
  )
}

export default Step
