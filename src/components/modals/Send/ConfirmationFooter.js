// @flow
import React from 'react'
import Button from 'components/base/Button'
import { ModalFooter } from 'components/base/Modal'
import type { T } from 'types/common'

export default ({
  t,
  txValidated,
  onClose,
  onGoToFirstStep,
}: {
  t: T,
  txValidated: ?string,
  onClose: () => void,
  onGoToFirstStep: () => void,
}) => (
  <ModalFooter horizontal alignItems="center" justifyContent="flex-end" flow={2}>
    <Button onClick={onClose}>{t('common:close')}</Button>
    {txValidated ? (
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
