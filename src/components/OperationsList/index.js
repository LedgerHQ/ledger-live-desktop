// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import {
  groupAccountOperationsByDay,
  groupAccountsOperationsByDay,
} from '@ledgerhq/live-common/lib/helpers/account'

import type { Account } from '@ledgerhq/live-common/lib/types'

import noop from 'lodash/noop'
import keyBy from 'lodash/keyBy'

import type { T } from 'types/common'

import { MODAL_OPERATION_DETAILS } from 'config/constants'

import { openModal } from 'reducers/modals'

import IconAngleDown from 'icons/AngleDown'

import Box, { Card } from 'components/base/Box'
import Text from 'components/base/Text'
import Defer from 'components/base/Defer'

import Operation from './Operation'

const calendarOpts = {
  sameDay: 'LL – [Today]',
  nextDay: 'LL – [Tomorrow]',
  lastDay: 'LL – [Yesterday]',
  lastWeek: 'LL',
  sameElse: 'LL',
}

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
  canShowMore: boolean,
  openModal: Function,
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
    canShowMore: false,
  }

  state = initialState

  handleClickOperation = (data: Object) => this.props.openModal(MODAL_OPERATION_DETAILS, data)

  // TODO: convert of async/await if fetching with the api
  fetchMoreOperations = () => {
    this.setState({ nbToShow: this.state.nbToShow + 20 })
  }

  render() {
    const { account, accounts, canShowMore, t, title, withAccount } = this.props
    const { nbToShow } = this.state

    const totalOperations = accounts
      ? accounts.reduce((a, b) => +a + +b.operations.length, 0)
      : account.operations.length

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
          {groupedOperations.sections.map(group => {
            const d = moment(group.day)
            return (
              <Box flow={2} key={group.day.toISOString()}>
                <Box ff="Open Sans|SemiBold" fontSize={4} color="grey">
                  {d.calendar(null, calendarOpts)}
                </Box>
                <Card p={0}>
                  {group.data.map(op => {
                    const account = accountsMap[op.accountId]
                    if (!account) {
                      return null
                    }
                    return (
                      <Operation
                        account={account}
                        key={op.id}
                        onOperationClick={this.handleClickOperation}
                        op={op}
                        t={t}
                        withAccount={withAccount}
                      />
                    )
                  })}
                </Card>
              </Box>
            )
          })}
          {canShowMore &&
            totalOperations > nbToShow && (
              <ShowMore onClick={this.fetchMoreOperations}>
                <span>{t('operationsList:showMore')}</span>
                <IconAngleDown size={12} />
              </ShowMore>
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
