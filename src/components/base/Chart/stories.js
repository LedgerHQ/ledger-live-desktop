// @flow

import React, { Component, Fragment } from 'react'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'
import Chance from 'chance'
import moment from 'moment'
import { storiesOf } from '@storybook/react'
import { boolean, number } from '@storybook/addon-knobs'
import { color } from '@storybook/addon-knobs/react'

import Chart from 'components/base/Chart'

const stories = storiesOf('Components/base', module)

const data = generateRandomData(365)
const unit = getCryptoCurrencyById('bitcoin').units[0]

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
        <input type="range" value={start} onChange={this.handleChange('start')} min={0} max={365} />
        <input
          type="range"
          value={stop}
          style={{ marginLeft: 10 }}
          onChange={this.handleChange('stop')}
          min={0}
          max={365}
        />

        <Chart
          isInteractive={boolean('isInteractive', true)}
          hideAxis={boolean('hideAxis', false)}
          color={color('color', '#5f8ced')}
          data={data.slice(start, stop)}
          height={number('height', 300)}
          unit={unit}
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
    data.push({
      date: day.toDate(),
      value: chance.integer({ min: 0.5e8, max: 1e8 }),
    })
    day.add(1, 'day')
  }
  return data
}
