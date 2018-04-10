// @flow

/* eslint-disable react/no-array-index-key */

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Step from './Step'

type Props = {
  items: Array<Object>,
  currentStep: number | string,
}

const Wrapper = styled(Box).attrs({
  horizontal: true,
  alignItems: 'center',
  justifyContent: 'center',
  relative: true,
})`
  margin-bottom: 25px;
  z-index: 2;
`

const Bar = styled.div`
  background: ${p => p.theme.colors.fog};
  flex-grow: 1;
  height: 1px;
  left: ${p => p.start}%;
  position: absolute;
  right: ${p => p.start}%;
  top: 8px;
  z-index: 1;

  &:after {
    background: ${p => p.theme.colors.wallet};
    bottom: 0;
    content: '';
    display: block;
    left: 0;
    position: absolute;
    right: ${p => (p.current === 0 ? 0 : `${p.current}%`)};
    top: 0;
    transition: right ease-in-out 0.4s;
  }
`

class Breadcrumb extends PureComponent<Props> {
  render() {
    const { items, currentStep, ...props } = this.props
    const itemsLength = items.length
    const start = 100 / itemsLength / 2
    return (
      <Box {...props} relative>
        <Wrapper>
          {items.map((item, i) => (
            <Step
              key={i}
              isActive={i <= parseInt(currentStep, 10)}
              isFirst={i === 0}
              number={i + 1}
            >
              {item.label}
            </Step>
          ))}
        </Wrapper>
        <Bar
          start={start}
          current={!currentStep ? 100 : 100 - 100 / (itemsLength - 1) * parseInt(currentStep, 10)}
        />
      </Box>
    )
  }
}

export default Breadcrumb
