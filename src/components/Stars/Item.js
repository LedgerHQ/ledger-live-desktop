// @flow

import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account/helpers'
import type { Account, TokenAccount } from '@ledgerhq/live-common/src/types'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'
import CryptoCurrencyIcon from '../CryptoCurrencyIcon'
import Box from '../base/Box/Box'
import { focusedShadowStyle } from '../base/Box/Tabbable'

const AccountName = styled(Text)``
const ItemWrapper = styled.div`
  height: 60px;
  flex: 1;
  align-items: center;
  display: flex;
  padding: 0px 15px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: ${p => (p.active ? p.theme.colors.lightGrey : 'white')};
  &:hover ${AccountName} {
    color: ${p => p.theme.colors.dark};
  }
  &:active {
    border-color: ${p => (p.active ? p.theme.colors.lightFog : p.theme.colors.sliderGrey)};
    box-shadow: 0 12px 17px 0 rgba(0, 0, 0, 0.1);
  }

  &:focused {
    box-shadow: ${focusedShadowStyle};
  }
`

const mapDispatchToProps = {
  push,
}

const Item = ({
  account,
  index,
  push,
  location: { pathname },
}: {
  account: Account | TokenAccount,
  index: number,
  push: Function,
  location: any,
}) => {
  const active = pathname.endsWith(account.id)

  const onAccountClick = useCallback(() => {
    const parentAccountId = account.type === 'TokenAccount' ? account.parentId : undefined
    parentAccountId
      ? push(`/account/${parentAccountId}/${account.id}`)
      : push(`/account/${account.id}`)
  }, [account, push])

  return (
    <Draggable index={index} draggableId={account.id}>
      {provided => (
        <ItemWrapper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
          active={active}
          onClick={onAccountClick}
        >
          <Box horizontal ff="Open Sans|SemiBold" flex={1} flow={3} alignItems="center">
            <CryptoCurrencyIcon
              inactive={!active}
              currency={getAccountCurrency(account)}
              size={16}
            />
            <Box vertical flex={1}>
              <AccountName color="smoke">
                {account.type === 'Account' ? account.name : account.token.name}
              </AccountName>
              <FormattedVal
                alwaysShowSign={false}
                animateTicker={false}
                ellipsis
                color="grey"
                unit={account.unit || account.token.units[0]}
                showCode
                val={account.balance}
                disableRounding
              />
            </Box>
          </Box>
        </ItemWrapper>
      )}
    </Draggable>
  )
}

export default compose(
  // $FlowFixMe
  withRouter,
  connect(
    null,
    mapDispatchToProps,
  ),
)(Item)
