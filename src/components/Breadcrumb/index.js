// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const BreadcrumbWrapper = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  relative: true,
})``

const BreadcrumbStep = styled(({ start, active, end, ...props }) => (
  <Box start={start} end={end} active={active} {...props} />
)).attrs({
  color: p => (p.active ? 'blue' : 'mouse'),
  align: 'center',
  flow: 5,
  relative: true,
})`
  transition: color ease-in-out 0.1s ${p => (p.active ? 0.4 : 0)}s;
`

const BreadcrumbSeparator = styled(Box).attrs({
  grow: true,
  relative: true,
})`
  &:before,
  &:after {
    background: ${p => p.theme.colors.pearl};
    content: ' ';
    display: block;
    height: 2px;
    left: -20px;
    position: absolute;
    right: -20px;
    top: -13px;
  }

  &:after {
    background: ${p => p.theme.colors.blue};
    right: ${p => (p.active ? '-20px' : 'calc(100% + 20px)')};
    transition: right ease-in-out 0.4s;
  }
`

const BreadcrumbNumberWrapper = styled(Box).attrs({
  bg: 'white',
  px: 3,
  relative: true,
})`
  z-index: 1;
`
const BreadcrumbNumber = styled(Box).attrs({
  color: p => (p.active ? 'white' : 'mouse'),
  bg: p => (p.active ? 'blue' : 'pearl'),
  align: 'center',
  justify: 'center',
})`
  border-radius: 50%;
  box-shadow: ${p => `0 0 0 ${p.active ? 4 : 0}px ${p.theme.colors.cream}`};
  font-size: 9px;
  height: 20px;
  width: 20px;
  transition: all ease-in-out 0.1s ${p => (p.active ? 0.4 : 0)}s;
`

type Props = {
  items: Array<Object>,
  currentStep: number | string,
}

class Breadcrumb extends PureComponent<Props> {
  render() {
    const { items, currentStep } = this.props
    return (
      <BreadcrumbWrapper>
        {items.map((item, i) => {
          const active = i < parseInt(currentStep, 10)
          const start = i === 0
          return (
            <Fragment
              key={i} // eslint-disable-line react/no-array-index-key
            >
              {!start && <BreadcrumbSeparator active={active} />}
              <BreadcrumbStep active={active}>
                <BreadcrumbNumberWrapper>
                  <BreadcrumbNumber active={active}>{i + 1}</BreadcrumbNumber>
                </BreadcrumbNumberWrapper>
                <Box fontSize={3}>{item.label}</Box>
              </BreadcrumbStep>
            </Fragment>
          )
        })}
      </BreadcrumbWrapper>
    )
  }
}

export default Breadcrumb
