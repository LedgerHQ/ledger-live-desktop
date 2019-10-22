// @flow

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { push } from 'react-router-redux'
import type { AccountLike } from '@ledgerhq/live-common/lib/types'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account'
import Tooltip from 'components/base/Tooltip'
import { Hide } from 'components/MainSideBar'
import Text from 'components/base/Text'
import Image from 'components/base/Image'
import { dragDropStarAction } from '../../actions/settings'
import { starredAccountsEnforceHideEmptyTokenSelector } from '../../reducers/accounts'
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
  starredAccounts: AccountLike[],
  dragDropStarAction: (*) => any,
  collapsed: boolean,
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
    const { starredAccounts, pathname, collapsed } = this.props
    return starredAccounts && starredAccounts.length ? (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="list" direction="vertical">
          {(provided, snapshot) => (
            <Container key={pathname} ref={provided.innerRef}>
              {starredAccounts.map((account, i) => (
                <Tooltip
                  content={
                    account.type === 'Account' ? account.name : getAccountCurrency(account).name
                  }
                  delay={collapsed ? 0 : 1200}
                  key={account.id}
                  placement={collapsed ? 'right' : 'top'}
                  boundary={collapsed ? 'window' : undefined}
                  enabled={!snapshot.isDraggingOver}
                >
                  <Item
                    index={i}
                    key={account.id}
                    account={account}
                    pathname={pathname}
                    collapsed={collapsed}
                  />
                </Tooltip>
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    ) : (
      <Hide visible={!collapsed}>
        <Placeholder>
          <Image
            alt="stars placeholder"
            resource="empty-bookmarks.png"
            width="95"
            height="53"
            themeTyped
          />
          <Text
            ff="Inter|SemiBold"
            color="palette.text.shade60"
            fontSize={3}
            style={{ minWidth: 180 }}
          >
            <Trans i18nKey={'stars.placeholder'}>
              {'Accounts that you star on the'}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {'Accounts'}
              </Text>
              {' page will now appear here!.'}
            </Trans>
          </Text>
        </Placeholder>
      </Hide>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Stars)
