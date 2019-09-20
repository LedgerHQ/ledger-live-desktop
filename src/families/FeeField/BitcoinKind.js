// @flow

import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Fees } from '@ledgerhq/live-common/lib/api/Fees'
import type { T } from 'types/common'
import { getAccountBridge } from 'bridge'
import { FeeNotLoaded, FeeRequired } from '@ledgerhq/errors'
import InputCurrency from 'components/base/InputCurrency'
import Select from 'components/base/Select'
import WithFeesAPI from 'components/WithFeesAPI'
import Box from 'components/base/Box'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  transaction: *,
  onChange: (*) => void,
  t: T,
}

type FeeItem = {
  label: string,
  value: *,
  blockCount: number,
  feePerByte: BigNumber,
}

const InputRight = styled(Box).attrs(() => ({
  ff: 'Rubik',
  color: 'palette.text.shade80',
  fontSize: 4,
  justifyContent: 'center',
  pr: 3,
}))``

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
  feePerByte: BigNumber(0),
}
const notLoadedItem = {
  label: 'Standard',
  value: 'standard',
  blockCount: 0,
  feePerByte: BigNumber(0),
}

type State = { isFocused: boolean, items: FeeItem[], selectedItem: FeeItem }

type OwnProps = Props & { fees?: Fees, error?: Error }

class FeesField extends Component<OwnProps, State> {
  state = {
    items: [notLoadedItem],
    selectedItem: notLoadedItem,
    isFocused: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { fees, error, transaction, account } = nextProps
    let items: FeeItem[] = []
    if (fees) {
      for (const key of Object.keys(fees)) {
        const feePerByte = BigNumber(Math.ceil(fees[key] / 1000))
        const blockCount = parseInt(key, 10)
        if (!isNaN(blockCount) && !feePerByte.isNaN()) {
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
    const bridge = getAccountBridge(account)
    const feePerByte = bridge.getTransactionExtra(account, transaction, 'feePerByte')
    items.push(!feePerByte && !error ? notLoadedItem : customItem)
    const selectedItem =
      feePerByte && prevState.selectedItem.feePerByte.eq(feePerByte)
        ? prevState.selectedItem
        : items.find(f => f.feePerByte.eq(feePerByte)) || items[items.length - 1]
    return { items, selectedItem }
  }

  componentDidUpdate({ fees: prevFees }: OwnProps) {
    const { account, transaction, fees, onChange } = this.props
    const bridge = getAccountBridge(account)
    const feePerByte = bridge.getTransactionExtra(account, transaction, 'feePerByte')
    const { items, isFocused } = this.state
    if (fees && fees !== prevFees && !feePerByte && !isFocused) {
      // initialize with the median
      const feePerByte = (items.find(item => item.blockCount === defaultBlockCount) || items[0])
        .feePerByte
      onChange(bridge.editTransactionExtra(account, transaction, 'feePerByte', feePerByte))
    }
  }

  onChangeFocus = isFocused => {
    this.setState({ isFocused })
  }

  onSelectChange = selectedItem => {
    const { onChange, account, transaction } = this.props
    const bridge = getAccountBridge(account)
    const patch: $Shape<State> = { selectedItem }
    if (!selectedItem.feePerByte.isZero()) {
      onChange(
        bridge.editTransactionExtra(account, transaction, 'feePerByte', selectedItem.feePerByte),
      )
    } else {
      const { input } = this
      if (selectedItem.feePerByte.isZero() && input.current) {
        patch.isFocused = true
        input.current.select()
        onChange(
          bridge.editTransactionExtra(account, transaction, 'feePerByte', selectedItem.feePerByte),
        )
      }
    }
    this.setState(patch)
  }

  onChange = value => {
    const { onChange, account, transaction } = this.props
    const bridge = getAccountBridge(account)
    onChange(bridge.editTransactionExtra(account, transaction, 'feePerByte', value))
  }

  input = React.createRef()

  render() {
    const { account, transaction, error, t } = this.props
    const { items, selectedItem } = this.state
    const { units } = account.currency
    const satoshi = units[units.length - 1]
    const bridge = getAccountBridge(account)
    const feePerByte = bridge.getTransactionExtra(account, transaction, 'feePerByte')

    return (
      <GenericContainer>
        <Box horizontal flow={5}>
          <Select
            menuPlacement="top"
            width={156}
            options={items}
            value={selectedItem}
            onChange={this.onSelectChange}
          />
          <InputCurrency
            ref={this.input}
            defaultUnit={satoshi}
            units={units}
            containerProps={{ grow: true }}
            value={feePerByte}
            onChange={this.onChange}
            onChangeFocus={this.onChangeFocus}
            loading={!feePerByte && !error}
            error={
              !feePerByte && error
                ? new FeeNotLoaded()
                : feePerByte && feePerByte.isZero()
                ? new FeeRequired()
                : null
            }
            renderRight={
              <InputRight>{t('send.steps.amount.unitPerByte', { unit: satoshi.code })}</InputRight>
            }
            allowZero
          />
        </Box>
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
