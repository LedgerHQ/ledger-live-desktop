// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import {
  groupAccountOperationsByDay,
  groupAccountsOperationsByDay,
  flattenAccounts,
} from '@ledgerhq/live-common/lib/account'
import logger from 'logger'
import type { Operation, Account, AccountLike } from '@ledgerhq/live-common/lib/types'

import keyBy from 'lodash/keyBy'

import type { T } from 'types/common'

import { MODAL_OPERATION_DETAILS } from 'config/constants'

import { openModal } from 'reducers/modals'

import IconAngleDown from 'icons/AngleDown'

import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import Track from 'analytics/Track'
import { track } from 'analytics/segment'
import { createStructuredSelector } from 'reselect'
import { accountsSelector } from 'reducers/accounts'

import SectionTitle from './SectionTitle'
import OperationC from './Operation'

const ShowMore = styled(Box).attrs(() => ({
  horizontal: true,
  flow: 1,
  ff: 'Inter|SemiBold',
  fontSize: 3,
  justify: 'center',
  align: 'center',
  p: 6,
  color: 'wallet',
}))`
  &:hover {
    text-decoration: underline;
  }
`

const mapDispatchToProps = {
  openModal,
}

type Props = {
  account: AccountLike,
  parentAccount?: ?Account,
  accounts: AccountLike[],
  allAccounts: AccountLike[],
  openModal: (string, Object) => *,
  t: T,
  withAccount?: boolean,
  withSubAccounts?: boolean,
  title?: string,
}

type State = {
  nbToShow: number,
}

const initialState = {
  nbToShow: 20,
}

export class OperationsList extends PureComponent<Props, State> {
  static defaultProps = {
    withAccount: false,
  }

  state = initialState

  handleClickOperation = (operation: Operation, account: AccountLike, parentAccount?: Account) =>
    this.props.openModal(MODAL_OPERATION_DETAILS, {
      operationId: operation.id,
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
    })

  // TODO: convert of async/await if fetching with the api
  fetchMoreOperations = () => {
    track('FetchMoreOperations')
    this.setState({ nbToShow: this.state.nbToShow + 20 })
  }

  render() {
    const {
      account,
      parentAccount,
      accounts,
      allAccounts,
      t,
      title,
      withAccount,
      withSubAccounts,
    } = this.props
    const { nbToShow } = this.state

    if (!account && !accounts) {
      console.warn('Preventing render OperationsList because not received account or accounts') // eslint-disable-line no-console
      return null
    }
    const groupedOperations = account
      ? groupAccountOperationsByDay(account, { count: nbToShow, withSubAccounts })
      : groupAccountsOperationsByDay(accounts, { count: nbToShow, withSubAccounts })

    const all = flattenAccounts(accounts || []).concat([account, parentAccount].filter(Boolean))
    const accountsMap = keyBy(all, 'id')

    return (
      <Box flow={4}>
        {title && (
          <Text
            color="palette.text.shade100"
            ff="Inter|Medium"
            fontSize={6}
            data-e2e="dashboard_OperationList"
          >
            {title}
          </Text>
        )}
        {groupedOperations.sections.map(group => (
          <Box flow={2} key={group.day.toISOString()}>
            <SectionTitle day={group.day} />
            <Card p={0}>
              {group.data.map(operation => {
                const account = accountsMap[operation.accountId]
                if (!account) {
                  logger.warn(`no account found for operation ${operation.id}`)
                  return null
                }
                let parentAccount
                if (account.type !== 'Account') {
                  const pa =
                    accountsMap[account.parentId] ||
                    allAccounts.find(a => a.id === account.parentId)
                  if (pa && pa.type === 'Account') {
                    parentAccount = pa
                  }
                  if (!parentAccount) {
                    logger.warn(`no token account found for token operation ${operation.id}`)
                    return null
                  }
                }
                return (
                  <OperationC
                    compact
                    operation={operation}
                    account={account}
                    parentAccount={parentAccount}
                    key={`${account.id}_${operation.id}`}
                    onOperationClick={this.handleClickOperation}
                    t={t}
                    withAccount={withAccount}
                  />
                )
              })}
            </Card>
          </Box>
        ))}
        {groupedOperations.completed ? (
          <Track
            onMount
            event="OperationsListEndReached"
            totalSections={groupedOperations.sections.length}
            totalOperations={groupedOperations.sections.reduce((sum, s) => sum + s.data.length, 0)}
          />
        ) : null}
        {!groupedOperations.completed ? (
          <ShowMore onClick={this.fetchMoreOperations}>
            <span>{t('common.showMore')}</span>
            <IconAngleDown size={12} />
          </ShowMore>
        ) : (
          <Box p={6} align="center">
            <Text ff="Inter" fontSize={3}>
              {t('operationList.noMoreOperations')}
            </Text>
          </Box>
        )}
      </Box>
    )
  }
}

export default compose(
  translate(),
  connect(
    createStructuredSelector({
      allAccounts: accountsSelector,
    }),
    mapDispatchToProps,
  ),
)(OperationsList)
