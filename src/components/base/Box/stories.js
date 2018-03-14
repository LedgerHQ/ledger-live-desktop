// @flow

import React from 'react'

import { select, boolean, number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const stories = storiesOf('Components/base/Box', module)

const align = [
  undefined,
  'baseline',
  'center',
  'flex-end',
  'flex-start',
  'inherit',
  'initial',
  'stretch',
]
const justify = [
  undefined,
  'center',
  'flex-end',
  'flex-start',
  'inherit',
  'initial',
  'space-around',
  'space-between',
]

stories.add('basic', () => (
  <Box
    alignItems={select('align', align, 'center')}
    flow={number('flow', undefined)}
    grow={boolean('grow', false)}
    horizontal={boolean('horizontal', false)}
    justifyContent={select('justify', justify, 'center')}
    padding={number('padding', undefined)}
    relative={boolean('relative', false)}
    sticky={boolean('sticky', true)}
  >
    \o/
  </Box>
))

const Container = props => <Box flow={10} {...props} />
const Row = props => <Box horizontal flow={10} {...props} />
const Col = styled(({ color, ...props }) => (
  <Box
    alignItems="center"
    grow
    justifyContent="center"
    style={{
      backgroundColor: color,
    }}
    {...props}
  />
))`
  height: 100px;
`

stories.add('grid example', () => (
  <Container>
    <Row>
      <Col color="blue">1</Col>
      <Col color="blue">2</Col>
      <Col color="blue">3</Col>
      <Col color="blue">4</Col>
      <Col color="blue">5</Col>
      <Col color="blue">6</Col>
      <Col color="blue">7</Col>
      <Col color="blue">8</Col>
      <Col color="blue">9</Col>
      <Col color="blue">10</Col>
    </Row>
    <Row>
      <Col color="red">1</Col>
      <Col color="red">2</Col>
      <Col color="red">3</Col>
      <Col color="red">4</Col>
      <Col color="red">5</Col>
      <Col color="red">6</Col>
    </Row>
    <Row>
      <Col color="green">1</Col>
      <Col color="green">2</Col>
      <Col color="green">3</Col>
    </Row>
    <Row>
      <Col color="yellow">1</Col>
    </Row>
  </Container>
))
