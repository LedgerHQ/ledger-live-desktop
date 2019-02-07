// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { MODAL_DISCLAIMER } from 'config/constants'

import Modal from 'components/base/Modal'
import ModalBody from 'components/base/Modal/ModalBody'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import { HandShield } from 'components/WarnBox'
import { compose } from 'redux'
import connect from 'react-redux/es/connect/connect'
import { closeModal } from '../../reducers/modals'

type Props = {
  t: T,
  closeModal: string => void,
}
const mapDispatchToProps = {
  closeModal,
}

class DisclaimerModal extends PureComponent<Props> {
  onClose = () => this.props.closeModal(MODAL_DISCLAIMER)
  render() {
    const { t } = this.props

    return (
      <Modal name={MODAL_DISCLAIMER} centered>
        <ModalBody
          onClose={this.onClose}
          title={t('disclaimerModal.title')}
          render={() => (
            <Box flow={4} ff="Open Sans|Regular" fontSize={4} color="smoke">
              <Box align="center" mt={4} pb={4}>
                <HandShield size={55} />
              </Box>
              <p>{t('disclaimerModal.desc_1')}</p>
              <p>{t('disclaimerModal.desc_2')}</p>
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end">
              <Button data-e2e="continue_button" onClick={this.onClose} primary>
                {t('disclaimerModal.cta')}
              </Button>
            </Box>
          )}
        />
      </Modal>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(DisclaimerModal)
