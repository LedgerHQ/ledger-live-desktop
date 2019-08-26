// @flow

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { push } from 'react-router-redux'
import type { Account, TokenAccount } from '@ledgerhq/live-common/src/types'

import SideBarTooltip from 'components/base/SideBar/SideBarTooltip'
import { Hide } from 'components/MainSideBar'
import Text from 'components/base/Text'
import { dragDropStarAction } from '../../actions/settings'
import { starredAccountsSelector } from '../../reducers/accounts'
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
  starredAccounts: starredAccountsSelector,
})

const mapDispatchToProps = {
  dragDropStarAction,
  push,
}

class Stars extends PureComponent<{
  pathname: string,
  starredAccounts: (Account | TokenAccount)[],
  dragDropStarAction: (*) => any,
  collapsed: boolean,
}> {
  onDragEnd = ({ source, destination }) => {
    const { dragDropStarAction, starredAccounts } = this.props
    if (destination) {
      dragDropStarAction({ from: source.index, to: destination.index, starredAccounts })
    }
  }

  render() {
    const { starredAccounts, pathname, collapsed } = this.props
    return starredAccounts && starredAccounts.length ? (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="list" direction="vertical">
          {provided => (
            <Container key={pathname} innerRef={provided.innerRef}>
              {starredAccounts.map((account: Account | TokenAccount, i) => (
                <SideBarTooltip
                  text={account.type === 'Account' ? account.name : account.token.name}
                  enabled={collapsed}
                >
                  <Item
                    index={i}
                    key={account.id}
                    account={account}
                    pathname={pathname}
                    collapsed={collapsed}
                  />
                </SideBarTooltip>
              ))}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    ) : (
      <Hide visible={!collapsed}>
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
      </Hide>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Stars)
