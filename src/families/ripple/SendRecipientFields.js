// @flow
import React, { useCallback } from 'react'
import { BigNumber } from 'bignumber.js'
import { Trans, translate } from 'react-i18next'
import type { Account, Transaction } from '@ledgerhq/live-common/lib/types'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import invariant from 'invariant'

type Props = {
  onChange: Transaction => void,
  transaction: Transaction,
  account: Account,
  t: *,
}

const uint32maxPlus1 = BigNumber(2).pow(32)

const TagField = ({ onChange, account, transaction, t }: Props) => {
  invariant(transaction.family === 'ripple', 'TagField: ripple family expected')
  const onChangeTag = useCallback(
    str => {
      const bridge = getAccountBridge(account)
      const tag = BigNumber(str.replace(/[^0-9]/g, ''))

      const patch = {
        tag:
          !tag.isNaN() &&
          tag.isFinite() &&
          tag.isInteger() &&
          tag.isPositive() &&
          tag.lt(uint32maxPlus1)
            ? tag.toNumber()
            : str === ''
            ? ''
            : transaction.tag,
      }
      onChange(bridge.updateTransaction(transaction, patch))
    },
    [onChange, account, transaction],
  )

  return (
    <Box vertical flow={5}>
      <Box grow>
        <Label mb={5}>
          <span>
            <Trans i18nKey="send.steps.details.rippleTag" />
          </span>
        </Label>
        <Input
          placeholder={t('send.steps.details.rippleTagPlaceholder')}
          ff="Inter"
          value={String(transaction.tag || '')}
          onChange={onChangeTag}
        />
      </Box>
    </Box>
  )
}

export default {
  component: translate()(TagField),
  fields: ['tag'],
}
