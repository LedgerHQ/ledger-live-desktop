// @flow

import React from 'react'
import { Trans } from 'react-i18next'
import type { AccountLike } from '@ledgerhq/live-common/lib/types'
import { isAccountDelegating } from '@ledgerhq/live-common/lib/families/tezos/bakers'

import IconChartLine from 'icons/ChartLine'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

type Props = {
  account: AccountLike,
}

export default ({ account }: Props) =>
  isAccountDelegating(account) ? null : (
    <Button small primary onClick={() => {}}>
      <Box horizontal flow={1} alignItems="center">
        <IconChartLine size={12} />
        <Box>
          <Trans i18nKey="delegation.title" />
        </Box>
      </Box>
    </Button>
  )
