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
  align: 'center',
  justify: 'center',
})`
  margin-bottom: 25px;
`

class Breadcrumb extends PureComponent<Props> {
  render() {
    const { items, currentStep } = this.props
    return (
      <Wrapper>
        {items.map((item, i) => (
          <Step key={i} isActive={i < parseInt(currentStep, 10)} isFirst={i === 0} number={i + 1}>
            {item.label}
          </Step>
        ))}
      </Wrapper>
    )
  }
}

export default Breadcrumb
