// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const BreadcrumbWrapper = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  flow: 20,
  relative: true,
})``
const BreadcrumbStep = styled(({ start, active, end, ...props }) => (
  <Box start={start} end={end} active={active} {...props} />
)).attrs({
  color: p => (p.active ? 'blue' : 'mouse'),
  align: 'center',
  flow: 5,
  grow: p => !p.start && !p.end,
  ml: p => p.end && 20,
  mr: p => p.start && 20,
  relative: true,
})`
  &:before,
  &:after {
    content: ' ';
    display: ${p => (p.start ? 'none' : 'block')};
    height: 2px;
    position: absolute;
    left: -120px;
    background: ${p => p.theme.colors.pearl};
    margin-top: 8px;
    width: 200px;
  }

  &:after {
    background: ${p => p.theme.colors.blue};
    width: ${p => (p.active ? 200 : 0)}px;
    transition: width ease-in-out 0.4s;
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
  transition: all ease-in-out 0.1s;
`

const Breadcrumb = ({ items, currentStep }: Object) => (
  <BreadcrumbWrapper>
    {items.map((item, i) => {
      const active = i < currentStep
      const start = i === 0
      const end = i + 1 === items.length
      return (
        <BreadcrumbStep
          key={i} // eslint-disable-line react/no-array-index-key
          start={start}
          end={end}
          active={active}
        >
          <BreadcrumbNumberWrapper>
            <BreadcrumbNumber active={active}>{i + 1}</BreadcrumbNumber>
          </BreadcrumbNumberWrapper>
          <Box fontSize={0}>{item.label}</Box>
        </BreadcrumbStep>
      )
    })}
  </BreadcrumbWrapper>
)

export default Breadcrumb
