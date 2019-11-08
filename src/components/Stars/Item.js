// @flow

import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from '@ledgerhq/live-common/lib/account/helpers'
import type { AccountLike } from '@ledgerhq/live-common/lib/types'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'
import ParentCryptoCurrencyIcon from 'components/ParentCryptoCurrencyIcon'
import { Hide } from 'components/MainSideBar'
import Ellipsis from 'components/base/Ellipsis'
import Box from '../base/Box/Box'

const AccountName = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
const ParentCryptoCurrencyIconWrapper = styled.div`
  width: 20px;
`

const ItemWrapper = styled.div.attrs(p => ({
  style: {
    backgroundColor: p.active
      ? p.theme.colors.palette.action.hover
      : p.theme.colors.palette.background.paper,
  },
}))`
  flex: 1;
  align-items: center;
  display: flex;
  padding: 10px 15px;
  width: 200px;
  border-radius: 4px;
  border: 1px solid transparent;
  margin-bottom: 10px;
  &:hover ${AccountName},&:active ${AccountName} {
    color: ${p => p.theme.colors.palette.text.shade100};
  }
  ${p =>
    p.isDragging
      ? `
    z-index: 1;
    border-color: ${p.active ? p.theme.colors.palette.divider : p.theme.colors.sliderGrey};
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
  account: AccountLike,
  index: number,
  push: Function,
  pathname: string,
  collapsed?: boolean,
}) => {
  const active = pathname.endsWith(account.id)

  const onAccountClick = useCallback(() => {
    const parentAccountId = account.type !== 'Account' ? account.parentId : undefined
    parentAccountId
      ? push(`/account/${parentAccountId}/${account.id}`)
      : push(`/account/${account.id}`)
  }, [account, push])

  const unit = getAccountUnit(account)

  return (
    <Draggable index={index} draggableId={account.id}>
      {(provided, snapshot) => (
        <ItemWrapper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          collapsed={collapsed}
          ref={provided.innerRef}
          active={active && !snapshot.isDragging}
          onClick={onAccountClick}
        >
          <Box horizontal ff="Inter|SemiBold" flex={1} flow={3} alignItems="center">
            <ParentCryptoCurrencyIconWrapper
              collapsed={collapsed}
              isToken={account.type === 'TokenAccount'}
            >
              <ParentCryptoCurrencyIcon inactive={!active} currency={getAccountCurrency(account)} />
            </ParentCryptoCurrencyIconWrapper>
            <Box vertical flex={1}>
              <Hide visible={snapshot.isDragging || !collapsed}>
                <Ellipsis color="palette.text.shade80">{getAccountName(account)}</Ellipsis>
                <FormattedVal
                  alwaysShowSign={false}
                  animateTicker={false}
                  ellipsis
                  color="palette.text.shade60"
                  unit={unit}
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
