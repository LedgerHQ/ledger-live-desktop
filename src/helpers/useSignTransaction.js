// @flow

import { useEffect, useRef, useCallback } from 'react'
import invariant from 'invariant'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import { track } from 'analytics/segment'

import { DisconnectedDevice, UserRefusedOnDevice } from '@ledgerhq/errors'

// FIXME
type SignTransactionArgs = *

export const useSignTransactionCallback = ({
  context,
  device,
  account,
  parentAccount,
  handleOperationBroadcasted,
  transaction,
  handleTransactionError,
  setSigned,
}: SignTransactionArgs) => {
  const signTransactionSubRef = useRef(null)

  useEffect(
    () => () => {
      if (signTransactionSubRef.current) {
        signTransactionSubRef.current.unsubscribe()
      }
    },
    [],
  )

  const handleSignTransaction = useCallback(
    async ({ transitionTo }: { transitionTo: string => void }) => {
      if (!account) return
      const mainAccount = getMainAccount(account, parentAccount)
      const bridge = getAccountBridge(account, parentAccount)
      if (!device) {
        handleTransactionError(new DisconnectedDevice())
        transitionTo('confirmation')
        return
      }

      invariant(account && transaction && bridge, 'signTransaction invalid conditions')

      const eventProps = {
        currencyName: mainAccount.currency.name,
        derivationMode: mainAccount.derivationMode,
        freshAddressPath: mainAccount.freshAddressPath,
        operationsLength: mainAccount.operations.length,
      }
      track(`${context}TransactionStart`, eventProps)
      signTransactionSubRef.current = bridge
        .signAndBroadcast(mainAccount, transaction, device.path)
        .subscribe({
          next: e => {
            switch (e.type) {
              case 'signed': {
                track(`${context}TransactionSigned`, eventProps)
                setSigned(true)
                transitionTo('confirmation')
                break
              }
              case 'broadcasted': {
                track(`${context}TransactionBroadcasted`, eventProps)
                handleOperationBroadcasted(e.operation)
                break
              }
              default:
            }
          },
          error: err => {
            if (err.statusCode === 0x6985) {
              track(`${context}TransactionRefused`, eventProps)
              handleTransactionError(new UserRefusedOnDevice())
              transitionTo('refused')
            } else {
              track(`${context}TransactionError`, eventProps)
              handleTransactionError(err)
              transitionTo('confirmation')
            }
          },
        })
    },
    [
      account,
      parentAccount,
      device,
      transaction,
      context,
      handleTransactionError,
      setSigned,
      handleOperationBroadcasted,
    ],
  )

  return handleSignTransaction
}
