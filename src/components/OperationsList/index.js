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
import Defer from 'components/base/Defer'

import SectionTitle from './SectionTitle'
import OperationC from './Operation'

const ShowMore = styled(Box).attrs({
  horizontal: true,
  flow: 1,
  ff: 'Open Sans|SemiBold',
  fontSize: 3,
  justify: 'center',
  align: 'center',
  p: 4,
  color: 'wallet',
})`
  cursor: pointer;
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

const footerPlaceholder = (
  <Box p={4} align="center">
    <Text ff="Open Sans" fontSize={3}>
      No more operations
    </Text>
  </Box>
)

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
      <Defer>
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
                      key={operation.id}
                      onOperationClick={this.handleClickOperation}
                      t={t}
                      withAccount={withAccount}
                    />
                  )
                })}
              </Card>
            </Box>
          ))}
          {!groupedOperations.completed ? (
            <ShowMore onClick={this.fetchMoreOperations}>
              <span>{t('operationsList:showMore')}</span>
              <IconAngleDown size={12} />
            </ShowMore>
          ) : (
            footerPlaceholder
          )}
        </Box>
      </Defer>
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
