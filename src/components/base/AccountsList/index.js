// @flow

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import type { Account } from '@ledgerhq/live-common/lib/types'

import Box from 'components/base/Box'
import FakeLink from 'components/base/FakeLink'
import Spinner from 'components/base/Spinner'
import type { T } from 'types/common'

import AccountRow from './AccountRow'

const AccountsList = ({
  accounts,
  checkedIds,
  onToggleAccount,
  onUpdateAccount,
  onSelectAll,
  onUnselectAll,
  isLoading,
  title,
  emptyText,
  t,
}: {
  accounts: Account[],
  checkedIds: string[],
  onToggleAccount: Account => void,
  onUpdateAccount: Account => void,
  onSelectAll: () => void,
  onUnselectAll: () => void,
  isLoading?: boolean,
  title?: string,
  emptyText?: string,
  t: T,
}) => {
  const withToggleAll = !!onSelectAll && !!onUnselectAll && accounts.length > 1
  const isAllSelected = accounts.every(acc => !!checkedIds.find(id => acc.id === id))
  return (
    <Box flow={3}>
      {(title || withToggleAll) && (
        <Box horizontal align="center">
          {title && (
            <Box ff="Open Sans|Bold" color="dark" fontSize={2} textTransform="uppercase">
              {title}
            </Box>
          )}
          {withToggleAll && (
            <FakeLink
              ml="auto"
              onClick={isAllSelected ? onUnselectAll : onSelectAll}
              fontSize={3}
              style={{ lineHeight: '10px' }}
            >
              {isAllSelected ? t('app:addAccounts.unselectAll') : t('app:addAccounts.selectAll')}
            </FakeLink>
          )}
        </Box>
      )}
      {accounts.length || isLoading ? (
        <Box flow={2}>
          {accounts.map(account => (
            <AccountRow
              key={account.id}
              account={account}
              isChecked={checkedIds.find(id => id === account.id) !== undefined}
              onClick={onToggleAccount}
              onAccountUpdate={onUpdateAccount}
              t={t}
            />
          ))}
          {isLoading && (
            <LoadingRow>
              <Spinner color="grey" size={16} />
            </LoadingRow>
          )}
        </Box>
      ) : emptyText && !isLoading ? (
        <Box ff="Open Sans|Regular" fontSize={3}>
          {emptyText}
        </Box>
      ) : null}
    </Box>
  )
}

const LoadingRow = styled(Box).attrs({
  horizontal: true,
  borderRadius: 1,
  px: 3,
  align: 'center',
  justify: 'center',
})`
  height: 48px;
  border: 1px dashed ${p => p.theme.colors.grey};
`

export default translate()(AccountsList)
