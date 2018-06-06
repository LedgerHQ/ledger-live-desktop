// @flow
import React from 'react'
import type { Operation, Account } from '@ledgerhq/live-common/lib/types'
import { shell } from 'electron'
import Button from 'components/base/Button'
import { ModalFooter } from 'components/base/Modal'
import { getAccountOperationExplorer } from '@ledgerhq/live-common/lib/explorers'
import type { T } from 'types/common'

export default ({
  t,
  error,
  account,
  optimisticOperation,
  onClose,
  onGoToFirstStep,
}: {
  t: T,
  error: ?Error,
  account: ?Account,
  optimisticOperation: ?Operation,
  onClose: () => void,
  onGoToFirstStep: () => void,
}) => {
  const url =
    optimisticOperation && account && getAccountOperationExplorer(account, optimisticOperation)
  return (
    <ModalFooter horizontal alignItems="center" justifyContent="flex-end" flow={2}>
      <Button onClick={onClose}>{t('common:close')}</Button>
      {optimisticOperation ? (
        // TODO: actually go to operations details
        url ? (
          <Button
            onClick={() => {
              shell.openExternal(url)
              onClose()
            }}
            primary
          >
            {t('send:steps.confirmation.success.cta')}
          </Button>
        ) : null
      ) : error ? (
        <Button onClick={onGoToFirstStep} primary>
          {t('send:steps.confirmation.error.cta')}
        </Button>
      ) : null}
    </ModalFooter>
  )
}
