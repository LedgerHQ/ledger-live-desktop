// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Modal, { ModalBody } from 'components/base/Modal'
import GenuineCheck from 'components/GenuineCheck'

type Props = {
  t: T,
  onSuccess: void => void,
  onFail: void => void,
  onUnavailable: Error => void,
}

class GenuineCheckModal extends PureComponent<Props> {
  renderBody = ({ onClose }) => {
    const { t, onSuccess, onFail, onUnavailable } = this.props
    return (
      <ModalBody
        onClose={onClose}
        title={t('genuinecheck.modal.title')}
        render={() => (
          <GenuineCheck onSuccess={onSuccess} onFail={onFail} onUnavailable={onUnavailable} />
        )}
      />
    )
  }

  render() {
    const { t, ...props } = this.props
    return <Modal {...props} render={this.renderBody} />
  }
}

export default translate()(GenuineCheckModal)
