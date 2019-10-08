// @flow
import React, { useCallback } from 'react'
import { compose } from 'redux'
import { translate, Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { refreshAccountsOrdering } from 'actions/general'
import { saveSettings } from 'actions/settings'
import { getOrderAccounts } from 'reducers/settings'
import Track from 'analytics/Track'
import BoldToggle from 'components/base/BoldToggle'
import Box from 'components/base/Box'
import DropDown, { DropDownItem } from 'components/base/DropDown'
import Text from 'components/base/Text'
import IconAngleDown from 'icons/AngleDown'

const items = ['balance|desc', 'balance|asc', 'name|asc', 'name|desc'].map(key => ({
  key,
  label: <Trans i18nKey={`accounts.order.${key}`} />,
}))

const Order = ({
  orderAccounts,
  saveSettings,
  refreshAccountsOrdering,
}: {
  orderAccounts: string,
  refreshAccountsOrdering: () => *,
  saveSettings: (*) => *,
}) => {
  const onChange = useCallback(
    o => {
      saveSettings({ orderAccounts: o.key })
      refreshAccountsOrdering()
    },
    [saveSettings, refreshAccountsOrdering],
  )

  const renderItem = useCallback(props => <OrderItem {...props} />, [])

  const value = items.find(item => item.key === orderAccounts)

  return (
    <DropDown
      flow={1}
      offsetTop={2}
      horizontal
      items={items}
      renderItem={renderItem}
      onChange={onChange}
      value={value}
    >
      <Track onUpdate event="ChangeSort" orderAccounts={orderAccounts} />
      <Text ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="common.sortBy" />
      </Text>
      <Box alignItems="center" color="wallet" ff="Inter|SemiBold" flow={1} fontSize={4} horizontal>
        <Text color="wallet">
          <Trans i18nKey={`accounts.order.${orderAccounts}`} />
        </Text>
        <IconAngleDown size={16} />
      </Box>
    </DropDown>
  )
}

const OrderItem = React.memo(({ item, isHighlighted, isActive }: *) => (
  <DropDownItem
    alignItems="center"
    justifyContent="flex-start"
    horizontal
    isHighlighted={isHighlighted}
    isActive={isActive}
    flow={2}
  >
    <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
  </DropDownItem>
))

const mapStateToProps = createStructuredSelector({
  orderAccounts: getOrderAccounts,
})

const mapDispatchToProps = {
  refreshAccountsOrdering,
  saveSettings,
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(Order)
