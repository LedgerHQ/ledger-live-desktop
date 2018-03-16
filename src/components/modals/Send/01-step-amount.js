// @flow

import React, { Fragment } from 'react'

import type { Account, T } from 'types/common'
import type { DoubleVal } from 'components/RequestAmount'

import Box from 'components/base/Box'
import SelectAccount from 'components/SelectAccount'
import Label from 'components/base/Label'
import LabelInfoTooltip from 'components/base/LabelInfoTooltip'
import RecipientAddress from 'components/RecipientAddress'
import RequestAmount from 'components/RequestAmount'
import Select from 'components/base/Select'
import Input from 'components/base/Input'

type Props = {
  account: Account | null,
  onChange: Function,
  recipientAddress: string,
  amount: DoubleVal,
  t: T,
}

function StepAmount(props: Props) {
  const { onChange, account, recipientAddress, t, amount } = props

  return (
    <Box flow={4}>
      <Box flow={1}>
        <Label>{t('send:steps.amount.selectAccountDebit')}</Label>
        <SelectAccount onChange={onChange('account')} value={account} />
      </Box>
      <Box flow={1}>
        <Label>
          <span>{t('send:steps.amount.recipientAddress')}</span>
          <LabelInfoTooltip ml={1} text={t('send:steps.amount.recipientAddress')} />
        </Label>
        <RecipientAddress
          withQrCode
          value={recipientAddress}
          onChange={onChange('recipientAddress')}
        />
      </Box>
      {account && (
        <Fragment>
          <Box flow={1}>
            <Label>{t('send:steps.amount.amount')}</Label>
            <RequestAmount account={account} onChange={onChange('amount')} value={amount} />
          </Box>
          <Box flow={1}>
            <Label>
              <span>{t('send:steps.amount.fees')}</span>
              <LabelInfoTooltip ml={1} text={t('send:steps.amount.fees')} />
            </Label>
            <Box horizontal flow={5}>
              <Select
                placeholder="Choose a chess player..."
                items={[{ key: 'custom', name: 'Custom' }]}
                value={{ key: 'custom', name: 'Custom' }}
                renderSelected={item => item.name}
                onChange={onChange('fees')}
              />
              <Input containerProps={{ grow: true }} />
            </Box>
          </Box>
        </Fragment>
      )}
    </Box>
  )
}

export default StepAmount
