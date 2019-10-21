// @flow

import React, { PureComponent } from 'react'
import { getAccountCurrency, getAccountUnit } from '@ledgerhq/live-common/lib/account'
import { getCurrencyColor } from 'helpers/getCurrencyColor'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import AccountDistribution from 'components/AccountDistribution'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import type { Account } from '@ledgerhq/live-common/lib/types/account'
import { accountsSelector } from 'reducers/accounts'
import Box from 'components/base/Box'
import OperationsList from 'components/OperationsList'
import { withTheme } from 'styled-components'
import BalanceSummary from './BalanceSummary'
import {
  counterValueCurrencySelector,
  countervalueFirstSelector,
  selectedTimeRangeSelector,
} from '../../reducers/settings'
import { flattenSortAccountsEnforceHideEmptyTokenSelector } from '../../actions/general'
import AssetHeader from './AssetHeader'

type Props = {
  match: {
    params: {
      assetId: string,
    },
    isExact: boolean,
    path: string,
    url: string,
  },
  t: T,
  accounts: Account[],
  allAccounts: Account[],
  counterValue: string,
  range: string,
  countervalueFirst: boolean,
  theme: any,
}

type State = {
  tab: Object,
  range: PortfolioRange,
}

const mapDispatchToProps = {
  push,
}

const mapStateToProps = (state, props) => ({
  range: selectedTimeRangeSelector(state),
  counterValue: counterValueCurrencySelector(state),
  allAccounts: accountsSelector(state),
  countervalueFirst: countervalueFirstSelector(state),
  accounts: flattenSortAccountsEnforceHideEmptyTokenSelector(state).filter(
    a => getAccountCurrency(a).id === props.match.params.assetId,
  ),
})

class AssetPage extends PureComponent<Props, State> {
  lookupParentAccount = (id: string): ?Account =>
    this.props.allAccounts.find(a => a.id === id) || null

  render() {
    const { t, accounts, counterValue, range, countervalueFirst, theme } = this.props
    const parentAccount =
      accounts[0].type !== 'Account' ? this.lookupParentAccount(accounts[0].parentId) : null
    const currency = getAccountCurrency(accounts[0])
    const unit = getAccountUnit(accounts[0])
    const color = getCurrencyColor(currency, theme.colors.palette.background.paper)

    return (
      <Box>
        <Box mb={24}>
          <AssetHeader account={accounts[0]} parentAccount={parentAccount} />
        </Box>
        <BalanceSummary
          countervalueFirst={countervalueFirst}
          currency={currency}
          range={range}
          chartColor={color}
          unit={unit}
          counterValue={counterValue}
          accounts={accounts}
          chartId={`asset-chart-${this.props.match.params.assetId}`}
        />
        <Box mt={40}>
          <AccountDistribution accounts={accounts} />
        </Box>
        <Box mt={40}>
          <OperationsList accounts={accounts} title={t('dashboard.recentActivity')} />
        </Box>
      </Box>
    )
  }
}

export default compose(
  withTheme,
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(AssetPage)
