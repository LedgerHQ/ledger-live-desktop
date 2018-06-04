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
  account,
  optimisticOperation,
  onClose,
  onGoToFirstStep,
}: {
  t: T,
  account: ?Account,
  optimisticOperation: ?Operation,
  onClose: () => void,
  onGoToFirstStep: () => void,
}) => (
  <ModalFooter horizontal alignItems="center" justifyContent="flex-end" flow={2}>
    <Button onClick={onClose}>{t('common:close')}</Button>
    {optimisticOperation ? (
      // TODO: actually go to operations details
      <Button
        onClick={() => {
          const url = account && getAccountOperationExplorer(account, optimisticOperation)
          if (url) {
            shell.openExternal(url)
          }
          onClose()
        }}
        primary
      >
        {t('send:steps.confirmation.success.cta')}
      </Button>
    ) : (
      <Button onClick={onGoToFirstStep} primary>
        {t('send:steps.confirmation.error.cta')}
      </Button>
    )}
  </ModalFooter>
)
