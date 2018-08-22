// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { MODAL_DISCLAIMER } from 'config/constants'

import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import { HandShield } from 'components/WarnBox'

type Props = {
  t: T,
}

class DisclaimerModal extends PureComponent<Props> {
  render() {
    const { t } = this.props

    return (
      <Modal
        name={MODAL_DISCLAIMER}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>{t('app:disclaimerModal.title')}</ModalTitle>
            <ModalContent flow={4} ff="Open Sans|Regular" fontSize={4} color="smoke">
              <Box align="center" mt={4} pb={4}>
                <HandShield size={55} />
              </Box>
              <p>{t('app:disclaimerModal.desc_1')}</p>
              <p>{t('app:disclaimerModal.desc_2')}</p>
            </ModalContent>
            <ModalFooter horizontal justifyContent="flex-end">
              <Button onClick={onClose} primary>
                {t('app:disclaimerModal.cta')}
              </Button>
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(DisclaimerModal)
