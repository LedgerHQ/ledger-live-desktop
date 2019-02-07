// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import ConfirmModal from 'components/base/Modal/ConfirmModal'
import { openUserDataFolderAndQuit } from 'helpers/reset'

type Props = {
  t: *,
  isOpened: boolean,
  onClose: () => *,
}

class ResetFallbackModal extends PureComponent<Props> {
  render() {
    const { t, isOpened, onClose } = this.props
    return (
      <ConfirmModal
        centered
        isOpened={isOpened}
        onConfirm={openUserDataFolderAndQuit}
        onClose={onClose}
        onReject={onClose}
        confirmText={'Open folder'}
        title={t('settings.resetFallbackModal.title')}
        desc={
          <div>
            <p>{t('settings.resetFallbackModal.part1')}</p>
            <p style={{ fontWeight: 'bold' }}>
              {t('settings.resetFallbackModal.part2')}
              {t('settings.resetFallbackModal.part3')}
              {t('settings.resetFallbackModal.part4')}
            </p>
            <p style={{ marginTop: 20 }}>{t('settings.resetFallbackModal.part5')}</p>
          </div>
        }
      />
    )
  }
}

export default translate()(ResetFallbackModal)
