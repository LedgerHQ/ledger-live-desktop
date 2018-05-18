// @flow

import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import styled from 'styled-components'

import InputCurrency from 'components/base/InputCurrency'
import Select from 'components/base/Select'
import type { Fees } from 'api/Fees'
import WithFeesAPI from '../WithFeesAPI'
import GenericContainer from './GenericContainer'
import Box from '../base/Box'

type Props = {
  account: Account,
  feePerByte: number,
  onChange: number => void,
}

type FeeItem = {
  key: string,
  blockCount: number,
  feePerByte: number,
}

const InputRight = styled(Box).attrs({
  ff: 'Rubik',
  color: 'graphite',
  fontSize: 4,
  justifyContent: 'center',
  pr: 3,
})``

const blockCountNameConvention = {
  '1': 'High', // (fast confirmation)',
  '3': 'Standard', // (normal confirmation)',
  '6': 'Low', // (slow confirmation)',
}

const customItem = {
  key: 'custom',
  blockCount: 0,
  feePerByte: 0,
}

class FeesField extends Component<Props & { fees?: Fees, error?: Error }, { items: FeeItem[] }> {
  state = {
    items: [customItem],
  }

  static getDerivedStateFromProps(nextProps) {
    const { fees } = nextProps
    let items: FeeItem[] = []
    if (fees) {
      for (const key of Object.keys(fees)) {
        const feePerByte = Math.floor(fees[key] / 1000)
        const blockCount = parseInt(key, 10)
        if (!isNaN(blockCount) && !isNaN(feePerByte)) {
          items.push({ key, blockCount, feePerByte })
        }
      }
      items = items.sort((a, b) => a.blockCount - b.blockCount)
    }
    items.push(customItem)
    return { items }
  }

  componentDidUpdate() {
    const { feePerByte, fees, onChange } = this.props
    const { items } = this.state
    if (fees && !feePerByte) {
      // initialize with the median
      onChange(items[Math.floor(items.length / 2)].feePerByte)
    }
  }

  onSelectChange = fee => {
    const { onChange } = this.props
    if (fee.feePerByte) onChange(fee.feePerByte)
  }

  renderItem = (item: FeeItem) =>
    item.blockCount
      ? blockCountNameConvention[item.blockCount] || `${item.blockCount} blocks`
      : 'Custom'

  render() {
    const { account, feePerByte, error, onChange } = this.props
    const { items } = this.state
    const { units } = account.currency

    const item = items.find(f => f.feePerByte === feePerByte) || items[items.length - 1]

    const satoshi = units[units.length - 1]

    return (
      <GenericContainer error={error} help="fee per byte">
        <Select
          style={{ width: 156 }}
          items={items}
          value={item}
          renderSelected={this.renderItem}
          renderItem={this.renderItem}
          onChange={this.onSelectChange}
        />
        <InputCurrency
          defaultUnit={satoshi}
          units={units}
          containerProps={{ grow: true }}
          value={feePerByte}
          onChange={onChange}
          renderRight={<InputRight>{satoshi.code} per Byte</InputRight>}
        />
      </GenericContainer>
    )
  }
}

export default (props: Props) => (
  <WithFeesAPI
    currency={props.account.currency}
    renderError={error => <FeesField {...props} error={error} />}
    renderLoading={() => <FeesField {...props} />}
    render={fees => <FeesField {...props} fees={fees} />}
  />
)
