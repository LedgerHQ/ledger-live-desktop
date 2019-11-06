// @flow

import React from 'react'
import SelectAccount from 'components/SelectAccount'
import { Trans } from 'react-i18next'
import Label from 'components/base/Label'
import { ACCOUNT_SELECTED, NEXT } from '../receiveFlow'
import Button from '../../../base/Button'

type Props = {
  send: string => void,
  context: any,
}

const SelectAccountStep = ({ send, context }: Props) => {
  const { account } = context

  return (
    <>
      <Label>
        <Trans i18nKey="receive.steps.chooseAccount.label" />
      </Label>
      <SelectAccount
        autoFocus
        withSubAccounts
        onChange={(acc, parentAcc) =>
          send({ type: ACCOUNT_SELECTED, account: acc, parentAccount: parentAcc })
        }
        value={account}
      />
    </>
  )
}

SelectAccountStep.Footer = ({ send, context }: Props) => {
  const { account } = context

  return (
    <Button disabled={!account} primary onClick={() => send(NEXT)}>
      <Trans i18nKey="common.continue" />
    </Button>
  )
}

export default SelectAccountStep
