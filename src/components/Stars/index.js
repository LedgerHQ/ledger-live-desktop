// @flow

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import type { Account, TokenAccount } from '@ledgerhq/live-common/src/types'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Text from 'components/base/Text'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { push } from 'react-router-redux'
import { dragDropStarAction } from '../../actions/settings'
import { starredAccountsEnforceHideEmptyTokenSelector } from '../../reducers/accounts'
import { i } from '../../helpers/staticPath'
import Item from './Item'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  text-align: center;
  padding: 0px 8px;
  & > :first-child {
    margin-bottom: 14px;
  }
`

const mapStateToProps = createStructuredSelector({
  starredAccounts: starredAccountsEnforceHideEmptyTokenSelector,
})

const mapDispatchToProps = {
  dragDropStarAction,
  push,
}

class Stars extends PureComponent<{
  pathname: string,
  starredAccounts: (Account | TokenAccount)[],
  dragDropStarAction: (*) => any,
}> {
  onDragEnd = ({ source, destination }) => {
    const { dragDropStarAction, starredAccounts } = this.props
    if (destination) {
      const from = source.index
      const to = destination.index

      dragDropStarAction({ from: starredAccounts[from].id, to: starredAccounts[to].id })
    }
  }

  render() {
    const { starredAccounts, pathname } = this.props
    return starredAccounts && starredAccounts.length ? (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="list" direction="vertical">
          {provided => (
            <Container key={pathname} innerRef={provided.innerRef}>
              {starredAccounts.map((account: Account | TokenAccount, i) => (
                <Item index={i} key={account.id} account={account} pathname={pathname} />
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    ) : (
      <Placeholder>
        <img alt="stars placeholder" src={i('starsPlaceholder.png')} width="95" height="53" />
        <Text ff="Open Sans|SemiBold" color="grey" fontSize={3}>
          <Trans i18nKey={'stars.placeholder'}>
            {'Accounts that you star on the'}
            <Text ff="Open Sans|SemiBold" color="dark">
              {'Accounts'}
            </Text>
            {' page will now appear here!.'}
          </Trans>
        </Text>
      </Placeholder>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Stars)
