// @flow

import React, { useCallback } from 'react'
import { Trans, translate } from 'react-i18next'

import BoldToggle from 'components/base/BoldToggle'
import Box from 'components/base/Box'
import DropDown, { DropDownItem } from 'components/base/DropDown'
import Text from 'components/base/Text'
import IconAngleDown from 'icons/AngleDown'

const Sort = ({ onSortChange, sort }) => {
  const onSortChangeWrapper = useCallback(({ selectedItem: item }) => {
    if (!item) {
      return
    }
    onSortChange(item.key)
  }, [])

  const sortItems = [
    {
      key: 'name',
      label: <Trans i18nKey="managerv2.applist.sort.name" />,
    },
    {
      key: 'marketcap',
      label: <Trans i18nKey="managerv2.applist.sort.marketcap" />,
    },
  ]

  const renderItem = useCallback(
    ({ item, isHighlighted, isActive }) => (
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
    ),
    [],
  )

  return (
    <DropDown
      flow={1}
      offsetTop={2}
      horizontal
      items={sortItems}
      renderItem={renderItem}
      onStateChange={onSortChangeWrapper}
      value={sortItems.find(item => item.key === sort)}
    >
      <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="managerv2.applist.sort.title" />
      </Text>
      <Box alignItems="center" color="wallet" ff="Inter|SemiBold" flow={1} fontSize={4} horizontal>
        <Text color="wallet">
          <Trans i18nKey={`managerv2.applist.sort.${sort || 'name'}`} />
        </Text>
        <IconAngleDown size={16} />
      </Box>
    </DropDown>
  )
}

export default translate()(Sort)
