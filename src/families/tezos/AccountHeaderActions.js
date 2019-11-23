// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import type { AccountLike, Account } from '@ledgerhq/live-common/lib/types'
import { isAccountDelegating } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import { openModal } from 'reducers/modals'
import IconChartLine from 'icons/ChartLine'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  dispatch: any => void,
}

const AccountHeaderActions = ({ account, parentAccount, dispatch }: Props) =>
  account.type !== 'Account' || isAccountDelegating(account) ? null : (
    <Button
      small
      primary
      onClick={() =>
        dispatch(
          openModal('MODAL_DELEGATE', {
            parentAccount,
            account,
            stepId: 'summary',
          }),
        )
      }
    >
      <Box horizontal flow={1} alignItems="center">
        <IconChartLine size={12} />
        <Box>
          <Trans i18nKey="delegation.title" />
        </Box>
      </Box>
    </Button>
  )

export default connect()(AccountHeaderActions)
