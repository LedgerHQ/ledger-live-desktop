// @flow

import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'

import { storiesOf } from '@storybook/react'
import { formatCurrencyUnit, getFiatCurrencyByTicker } from '@ledgerhq/live-common/lib/currencies'
import Chance from 'chance'

import Box from 'components/base/Box'

import FlipTicker from 'components/base/FlipTicker'

const stories = storiesOf('Components/base', module)

const unit = getFiatCurrencyByTicker('USD').units[0]
const chance = new Chance()

function getValue() {
  return formatCurrencyUnit(unit, BigNumber(chance.floating({ min: 1000, max: 100000 })), {
    showCode: true,
  })
}

class Wrapper extends Component<any, any> {
  state = {
    value: getValue(),
  }

  componentDidMount() {
    this.generateValue()
  }

  generateValue = () =>
    setTimeout(() => {
      this.setState({
        value: getValue(),
      })
      this.generateValue()
    }, 1000)

  render() {
    const { render } = this.props
    const { value } = this.state
    return render(value)
  }
}

stories.add('FlipTicker', () => (
  <Wrapper
    render={value => (
      <Box flow={2}>
        <FlipTicker value={value} fontSize={2} />
        <FlipTicker value={value} />
        <FlipTicker value={value} fontSize={8} />
        <Box>{value}</Box>
      </Box>
    )}
  />
))
