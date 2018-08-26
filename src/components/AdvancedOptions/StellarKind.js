// @flow
import React from 'react'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Spoiler from 'components/base/Spoiler'
import Select from 'components/base/Select'
import {
  StellarInvalidTextMemo,
  StellarInvalidIdMemo,
  StellarInvalidHashMemo,
  StellarInvalidEmptyMemo,
} from 'config/errors'
import { Memo } from 'stellar-sdk'

type Props = {
  memo: *,
  memoType: *,
  onChange: (?Object) => void,
  error: ?Error | boolean,
  t: *,
}

const validateMemoFromMemoType = (memo, memoType = 'MEMO_TEXT') => {
  if (!memo && memoType !== 'MEMO_NONE') {
    return new StellarInvalidEmptyMemo()
  }
  switch (memoType) {
    case 'MEMO_TEXT':
      try {
        Memo._validateTextValue(memo)
      } catch (_) {
        return new StellarInvalidTextMemo()
      }
      break
    case 'MEMO_ID':
      try {
        Memo._validateIdValue(memo)
        if (memo > 18446744073709551615) return new StellarInvalidIdMemo()
      } catch (_) {
        return new StellarInvalidIdMemo()
      }
      break
    case 'MEMO_HASH':
    case 'MEMO_RETURN':
      try {
        Memo._validateHashValue(memo)
      } catch (_) {
        return new StellarInvalidHashMemo()
      }
      break
    default:
    // Do nothing
  }
  return ''
}

export default translate()(
  ({ memo, memoType = { label: 'MEMO_NONE', value: '' }, error, onChange, t }: Props) => (
    <Spoiler title={t('app:send.steps.amount.advancedOptions')}>
      <Box horizontal align="center" flow={5}>
        <Box style={{ width: 200 }}>
          <Label>
            <span>{t('app:send.steps.amount.stellarMemoType')}</span>
          </Label>
        </Box>
        <Box grow>
          <Select
            small
            onChange={selection => {
              onChange({
                memoType: selection,
                memo: undefined,
                memoError: validateMemoFromMemoType(memo, selection.value),
              })
            }}
            renderSelected={item => item && item.name}
            value={memoType}
            options={[
              { label: 'MEMO_NONE', value: '' },
              { label: 'MEMO_ID', value: 'MEMO_ID' },
              { label: 'MEMO_TEXT', value: 'MEMO_TEXT' },
              { label: 'MEMO_HASH', value: 'MEMO_HASH' },
              { label: 'MEMO_RETURN', value: 'MEMO_RETURN' },
            ]}
          />
        </Box>
      </Box>
      {memoType.value ? (
        <Box vertical flow={5}>
          <Box>
            <Label>
              <span>{t('app:send.steps.amount.stellarMemo')}</span>
            </Label>
            <Input
              value={String(memo || '')}
              error={error || false}
              onChange={str => {
                // https://www.stellar.org/developers/guides/concepts/transactions.html#memo
                onChange({ memo: str, memoError: validateMemoFromMemoType(str, memoType.value) })
              }}
            />
          </Box>
        </Box>
      ) : (
        ''
      )}
    </Spoiler>
  ),
)
