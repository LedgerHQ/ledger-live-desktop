// @flow
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { useDelegation } from '@ledgerhq/live-common/lib/families/tezos/bakers'

import type { Account, AccountLike } from '@ledgerhq/live-common/lib/types'

import { MODAL_SEND, MODAL_RECEIVE } from 'config/constants'
import { openModal } from 'reducers/modals'

import {
  SendActionDefault,
  ReceiveActionDefault,
} from 'components/AccountPage/AccountActionsDefault'

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  onClick: () => void,
  openModal: (modal: string, opts?: *) => void,
}

const SendAction = ({ account, parentAccount, onClick, openModal }: Props) => {
  const delegation = useDelegation(account)
  const sendShouldWarnDelegation = delegation && delegation.sendShouldWarnDelegation

  const onClickDecorated = useCallback(() => {
    if (sendShouldWarnDelegation) {
      openModal(MODAL_SEND, {
        parentAccount,
        account,
        startWithWarning: sendShouldWarnDelegation,
      })
    } else {
      onClick()
    }
  }, [sendShouldWarnDelegation, parentAccount, account, openModal, onClick])

  return (
    <SendActionDefault onClick={onClickDecorated} account={account} parentAccount={parentAccount} />
  )
}

const ReceiveAction = ({ account, parentAccount, onClick, openModal }: Props) => {
  const delegation = useDelegation(account)
  const receiveShouldWarnDelegation = delegation && delegation.receiveShouldWarnDelegation

  const onClickDecorated = useCallback(() => {
    if (receiveShouldWarnDelegation) {
      openModal(MODAL_RECEIVE, {
        parentAccount,
        account,
        startWithWarning: receiveShouldWarnDelegation,
      })
    } else {
      onClick()
    }
  }, [receiveShouldWarnDelegation, parentAccount, account, openModal, onClick])

  return (
    <ReceiveActionDefault
      onClick={onClickDecorated}
      account={account}
      parentAccount={parentAccount}
    />
  )
}

export default {
  SendAction: connect(
    null,
    { openModal },
  )(SendAction),
  ReceiveAction: connect(
    null,
    { openModal },
  )(ReceiveAction),
}
