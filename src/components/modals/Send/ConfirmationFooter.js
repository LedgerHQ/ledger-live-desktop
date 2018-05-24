// @flow
import React from 'react'
import type { Operation } from '@ledgerhq/live-common/lib/types'
import Button from 'components/base/Button'
import { ModalFooter } from 'components/base/Modal'
import type { T } from 'types/common'

export default ({
  t,
  optimisticOperation,
  onClose,
  onGoToFirstStep,
}: {
  t: T,
  optimisticOperation: ?Operation,
  onClose: () => void,
  onGoToFirstStep: () => void,
}) => (
  <ModalFooter horizontal alignItems="center" justifyContent="flex-end" flow={2}>
    <Button onClick={onClose}>{t('common:close')}</Button>
    {optimisticOperation ? (
      // TODO: actually go to operations details
      <Button onClick={onClose} primary>
        {t('send:steps.confirmation.success.cta')}
      </Button>
    ) : (
      <Button onClick={onGoToFirstStep} primary>
        {t('send:steps.confirmation.error.cta')}
      </Button>
    )}
  </ModalFooter>
)
