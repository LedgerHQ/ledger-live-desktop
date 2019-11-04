// @flow

import React, { useState } from 'react'
import { ModalBody } from 'components/base/Modal'
import SelectAccount from 'components/SelectAccount'
import { Trans } from 'react-i18next'
import Label from 'components/base/Label'
import Button from 'components/base/Button'
import { ACCOUNT_SELECTED } from '../receiveFlow'

type Props = {
  send: string => void,
  context: any
}

const SelectAccountStep = ({ send, context }: Props) => {
  const [ account, setAccount ] = useState()

  return (
    <ModalBody
      render={() => (
        <>
          <Label>
            <Trans i18nKey="receive.steps.chooseAccount.label" />
          </Label>
          <SelectAccount autoFocus withSubAccounts onChange={setAccount} value={account} />
        </>
      )}
      renderFooter={() => (
        <Button
          disabled={!account}
          primary
          onClick={() => send({ type: ACCOUNT_SELECTED, account})}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      )}
    />
  )
}

export default SelectAccountStep