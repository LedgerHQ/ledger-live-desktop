// @flow

import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { getAccountCurrency } from '@ledgerhq/live-common/lib/account/helpers'
import type { Account, TokenAccount } from '@ledgerhq/live-common/src/types'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'
import ParentCryptoCurrencyIcon from 'components/ParentCryptoCurrencyIcon'
import { Hide } from 'components/MainSideBar'
import Box from '../base/Box/Box'

const AccountName = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
const ParentCryptoCurrencyIconWrapper = styled.div`
  width: 20px;
`

const ItemWrapper = styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  padding: 10px 15px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: ${p => (p.active ? p.theme.colors.lightGrey : 'white')};
  margin-bottom: 10px;
  &:hover ${AccountName},&:active ${AccountName} {
    color: ${p => p.theme.colors.dark};
  }
  ${p =>
    p.isDragging
      ? `
    z-index: 1;
    border-color: ${p.active ? p.theme.colors.lightFog : p.theme.colors.sliderGrey};
    box-shadow: 0 12px 17px 0 rgba(0, 0, 0, 0.1);
    width: ${p.collapsed ? '200px' : ''} !important;
        `
      : ''}
`

const mapDispatchToProps = {
  push,
}

const Item = ({
  account,
  index,
  push,
  pathname,
  collapsed,
}: {
  account: Account | TokenAccount,
  index: number,
  push: Function,
  pathname: string,
  collapsed?: boolean,
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
      {(provided, snapshot) => (
        <ItemWrapper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          collapsed={collapsed}
          innerRef={provided.innerRef}
          active={active}
          onClick={onAccountClick}
        >
          <Box horizontal ff="Open Sans|SemiBold" flex={1} flow={3} alignItems="center">
            <ParentCryptoCurrencyIconWrapper
              collapsed={collapsed}
              isToken={account.type === 'TokenAccount'}
            >
              <ParentCryptoCurrencyIcon inactive={!active} currency={getAccountCurrency(account)} />
            </ParentCryptoCurrencyIconWrapper>
            <Box vertical flex={1}>
              <Hide visible={snapshot.isDragging || !collapsed}>
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
                />
              </Hide>
            </Box>
          </Box>
        </ItemWrapper>
      )}
    </Draggable>
  )
}

export default connect(
  null,
  mapDispatchToProps,
)(Item)
