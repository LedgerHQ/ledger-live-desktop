// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import {
  groupAccountOperationsByDay,
  groupAccountsOperationsByDay,
} from '@ledgerhq/live-common/lib/helpers/account'

import type { Operation, Account } from '@ledgerhq/live-common/lib/types'

import keyBy from 'lodash/keyBy'

import type { T } from 'types/common'

import { MODAL_OPERATION_DETAILS } from 'config/constants'

import { openModal } from 'reducers/modals'

import IconAngleDown from 'icons/AngleDown'

import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import Track from 'analytics/Track'
import { track } from 'analytics/segment'

import SectionTitle from './SectionTitle'
import OperationC from './Operation'

const ShowMore = styled(Box).attrs({
  horizontal: true,
  flow: 1,
  ff: 'Open Sans|SemiBold',
  fontSize: 3,
  justify: 'center',
  align: 'center',
  p: 6,
  color: 'wallet',
})`
  &:hover {
    text-decoration: underline;
  }
`

const mapDispatchToProps = {
  openModal,
}

type Props = {
  account: Account,
  accounts: Account[],
  openModal: (string, Object) => *,
  t: T,
  withAccount?: boolean,
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

  handleClickOperation = (operation: Operation, account: Account) =>
    this.props.openModal(MODAL_OPERATION_DETAILS, {
      operationId: operation.id,
      accountId: account.id,
    })

  // TODO: convert of async/await if fetching with the api
  fetchMoreOperations = () => {
    track('FetchMoreOperations')
    this.setState({ nbToShow: this.state.nbToShow + 20 })
  }

  render() {
    const { account, accounts, t, title, withAccount } = this.props
    const { nbToShow } = this.state

    if (!account && !accounts) {
      console.warn('Preventing render OperationsList because not received account or accounts') // eslint-disable-line no-console
      return null
    }
    const groupedOperations = accounts
      ? groupAccountsOperationsByDay(accounts, nbToShow)
      : groupAccountOperationsByDay(account, nbToShow)

    const accountsMap = accounts ? keyBy(accounts, 'id') : { [account.id]: account }

    return (
      <Box flow={4}>
        {title && (
          <Text color="dark" ff="Museo Sans" fontSize={6}>
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
                  return null
                }
                return (
                  <OperationC
                    operation={operation}
                    account={account}
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
            <span>{t('app:common.showMore')}</span>
            <IconAngleDown size={12} />
          </ShowMore>
        ) : (
          <Box p={6} align="center">
            <Text ff="Open Sans" fontSize={3}>
              {t('app:operationList.noMoreOperations')}
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
    null,
    mapDispatchToProps,
  ),
)(OperationsList)
