// @flow

import React, { Fragment } from 'react'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import type { T } from 'types/common'

import Box from 'components/base/Box'
import CheckBox from 'components/base/CheckBox'
import { Textarea } from 'components/base/Input'
import InputCurrency from 'components/base/InputCurrency'
import Label from 'components/base/Label'
import LabelInfoTooltip from 'components/base/LabelInfoTooltip'
import RecipientAddress from 'components/RecipientAddress'
import RequestAmount from 'components/RequestAmount'
import Select from 'components/base/Select'
import SelectAccount from 'components/SelectAccount'
import Spoiler from 'components/base/Spoiler'

type PropsStepAmount = {
  account: Account | null,
  onChange: Function,
  recipientAddress: string,
  amount: number,
  fees: number,
  isRBF: boolean,
  t: T,
}

function StepAmount(props: PropsStepAmount) {
  const { onChange, fees, account, recipientAddress, t, amount, isRBF } = props

  return (
    <Box flow={4}>
      {/* ACCOUNT SELECTION */}
      <Box flow={1}>
        <Label>{t('send:steps.amount.selectAccountDebit')}</Label>
        <SelectAccount onChange={onChange('account')} value={account} />
      </Box>

      {account && (
        <Fragment>
          {/* RECIPIENT ADDRESS */}
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

          {/* AMOUNT */}
          <Box flow={1}>
            <Label>{t('send:steps.amount.amount')}</Label>
            <RequestAmount
              max={account.balance - fees}
              account={account}
              onChange={onChange('amount')}
              value={amount}
            />
          </Box>

          {/* FEES */}
          <Box flow={1}>
            <Label>
              <span>{t('send:steps.amount.fees')}</span>
              <LabelInfoTooltip ml={1} text={t('send:steps.amount.fees')} />
            </Label>
            <Box horizontal flow={5}>
              <Fees amount={fees} account={account} onChange={value => onChange('fees')(value)} />
            </Box>
          </Box>

          {/* ADVANCED OPTIONS */}
          <Spoiler title="Advanced options">
            {/* RBF transaction */}
            <Box horizontal align="center" flow={5}>
              <Box style={{ width: 200 }}>
                <Label>
                  <span>{t('send:steps.amount.useRBF')}</span>
                  <LabelInfoTooltip ml={1} text={t('send:steps.amount.useRBF')} />
                </Label>
              </Box>
              <Box grow>
                <CheckBox isChecked={isRBF} onChange={onChange('isRBF')} />
              </Box>
            </Box>

            {/* Message */}
            <Box horizontal align="flex-start" flow={5}>
              <Box style={{ width: 200 }}>
                <Label>
                  <span>{t('send:steps.amount.message')}</span>
                </Label>
              </Box>
              <Box grow>
                <Textarea />
              </Box>
            </Box>
          </Spoiler>
        </Fragment>
      )}
    </Box>
  )
}

type PropsFees = {
  account: Account,
  amount: number,
  onChange: Function,
}

function Fees(props: PropsFees) {
  const { onChange, account, amount } = props
  const { units } = account.currency

  return (
    <Fragment>
      <Select
        style={{ width: 156 }}
        items={[{ key: 'custom', name: 'Custom' }]}
        value={{ key: 'custom', name: 'Custom' }}
        renderSelected={item => item.name}
        onChange={() => onChange(amount)}
      />
      <InputCurrency
        unit={units[0]}
        units={units}
        containerProps={{ grow: true }}
        value={amount}
        onChange={onChange}
      />
    </Fragment>
  )
}

export default StepAmount
