// @flow

import React, { Component } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'
import Track from 'analytics/Track'
import BoldToggle from 'components/base/BoldToggle'
import Box from 'components/base/Box'
import DropDown, { DropDownItem } from 'components/base/DropDown'
import Text from 'components/base/Text'
import IconAngleDown from 'icons/AngleDown'

type Props = {
  t: T,
  onRangeChange: string => void,
  range: string,
}

class Range extends Component<Props> {
  onRangeChange = ({ selectedItem: item }) => {
    if (!item) {
      return
    }
    this.props.onRangeChange(item.key)
  }

  getRangeItems = () => {
    const { t } = this.props
    return [
      {
        key: 'week',
        label: t('accounts.range.week'),
      },
      {
        key: 'month',
        label: t('accounts.range.month'),
      },
      {
        key: 'year',
        label: t('accounts.range.year'),
      },
    ]
  }

  renderItem = ({ item, isHighlighted, isActive }) => (
    <DropDownItem
      alignItems="center"
      justifyContent="flex-start"
      horizontal
      isHighlighted={isHighlighted}
      isActive={isActive}
      flow={2}
    >
      <Box grow alignItems="flex-start">
        <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
      </Box>
    </DropDownItem>
  )

  render() {
    const { t, range } = this.props

    const rangeItems = this.getRangeItems()

    return (
      <DropDown
        flow={1}
        offsetTop={2}
        horizontal
        items={rangeItems}
        renderItem={this.renderItem}
        onStateChange={this.onRangeChange}
        value={rangeItems.find(item => item.key === range)}
      >
        <Track onUpdate event="ChangeRange" range={rangeItems} />
        <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize={4}>
          {t('common.range')}
        </Text>
        <Box
          alignItems="center"
          color="wallet"
          ff="Inter|SemiBold"
          flow={1}
          fontSize={4}
          horizontal
        >
          <Text color="wallet">{t(`accounts.range.${range || 'week'}`)}</Text>
          <IconAngleDown size={16} />
        </Box>
      </DropDown>
    )
  }
}

export default translate()(Range)
