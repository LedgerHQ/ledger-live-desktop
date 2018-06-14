// @flow

import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

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
  t: T
}

type FeeItem = {
  label: string,
  value: string,
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
const defaultBlockCount = 3

const customItem = {
  label: 'Custom',
  value: 'custom',
  blockCount: 0,
  feePerByte: 0,
}

class FeesField extends Component<
  Props & { fees?: Fees, error?: Error },
  { isFocused: boolean, items: FeeItem[], selectedItem: FeeItem },
> {
  state = {
    items: [customItem],
    selectedItem: customItem,
    isFocused: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { fees, feePerByte } = nextProps
    let items: FeeItem[] = []
    if (fees) {
      for (const key of Object.keys(fees)) {
        const feePerByte = Math.ceil(fees[key] / 1000)
        const blockCount = parseInt(key, 10)
        if (!isNaN(blockCount) && !isNaN(feePerByte)) {
          items.push({
            blockCount,
            label: blockCountNameConvention[blockCount] || `${blockCount} blocks`,
            feePerByte,
            value: key,
          })
        }
      }
      items = items.sort((a, b) => a.blockCount - b.blockCount)
    }
    items.push(customItem)
    const selectedItem =
      prevState.selectedItem.feePerByte === feePerByte
        ? prevState.selectedItem
        : items.find(f => f.feePerByte === feePerByte) || items[items.length - 1]
    return { items, selectedItem }
  }

  componentDidUpdate() {
    const { feePerByte, fees, onChange } = this.props
    const { items, isFocused } = this.state
    if (fees && !feePerByte && !isFocused) {
      // initialize with the median
      const feePerByte = (items.find(item => item.blockCount === defaultBlockCount) || items[0])
        .feePerByte
      onChange(feePerByte)
    }
  }

  onChangeFocus = isFocused => {
    this.setState({ isFocused })
  }

  onSelectChange = selectedItem => {
    const { onChange } = this.props
    this.setState({ selectedItem })
    if (selectedItem.feePerByte) onChange(selectedItem.feePerByte)
  }

  render() {
    const { account, feePerByte, error, onChange, t } = this.props
    const { items, selectedItem } = this.state
    const { units } = account.currency

    const satoshi = units[units.length - 1]

    return (
      <GenericContainer error={error} help={t('app:send.steps.amount.unitPerByte')}>
        <Select width={156} options={items} value={selectedItem} onChange={this.onSelectChange} />
        <InputCurrency
          defaultUnit={satoshi}
          units={units}
          containerProps={{ grow: true }}
          value={feePerByte}
          onChange={onChange}
          onChangeFocus={this.onChangeFocus}
          renderRight={<InputRight>{t('app:send.steps.amount.unitPerByte', { unit: satoshi.code })}</InputRight>}
        />
      </GenericContainer>
    )
  }
}

export default translate()((props: Props) => (
  <WithFeesAPI
    currency={props.account.currency}
    renderError={error => <FeesField {...props} error={error} />}
    renderLoading={() => <FeesField {...props} />}
    render={fees => <FeesField {...props} fees={fees} />}
  />
))
