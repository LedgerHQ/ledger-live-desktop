// @flow

import React, { Component, Fragment } from 'react'
import { BigNumber } from 'bignumber.js'
import Chance from 'chance'
import moment from 'moment'
import { storiesOf } from '@storybook/react'
import { boolean, number } from '@storybook/addon-knobs'
import { color } from '@storybook/addon-knobs/react'

import Chart from 'components/base/Chart'
import Box from 'components/base/Box'

const stories = storiesOf('Components/base', module)

const data = generateRandomData(365)

type State = {
  start: number,
  stop: number,
}

class Wrapper extends Component<any, State> {
  state = {
    start: 0,
    stop: 365,
  }

  handleChange = key => e => this.setState({ [key]: Number(e.target.value) })

  render() {
    const { start, stop } = this.state
    return (
      <Fragment>
        <Box mb={8} horizontal>
          <input
            type="range"
            value={start}
            onChange={this.handleChange('start')}
            min={0}
            max={365}
          />
          <input
            type="range"
            value={stop}
            style={{ marginLeft: 10 }}
            onChange={this.handleChange('stop')}
            min={0}
            max={365}
          />
        </Box>

        <Chart
          isInteractive={boolean('isInteractive', true)}
          hideAxis={boolean('hideAxis', true)}
          color={color('color', '#5f8ced')}
          data={data.slice(start, stop)}
          height={number('height', 300)}
        />
      </Fragment>
    )
  }
}

stories.add('Chart', () => <Wrapper />)

function generateRandomData(n) {
  const today = moment()
  const day = moment(today).subtract(n, 'days')
  const data = []
  const chance = new Chance()
  while (!day.isSame(today)) {
    const value = BigNumber(chance.integer({ min: 0.5e8, max: 1e8 }))
    data.push({
      date: day.toDate(),
      value,
      originalValue: value,
    })
    day.add(1, 'day')
  }
  return data
}
