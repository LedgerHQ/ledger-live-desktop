// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import Modal, { ModalBody } from 'components/base/Modal'
import Text from 'components/base/Text'
import SelectAccount from 'components/SelectAccount'

import type { Account as AccountType, T } from 'types/common'

type Props = {
  t: T,
}

type State = {
  account: AccountType | null,
}

class ReceiveModal extends PureComponent<Props, State> {
  state = {
    account: null,
  }

  handleChangeAccount = account => {
    this.setState({ account })
  }

  render() {
    const { account } = this.state
    const { t } = this.props
    return (
      <Modal
        name="receive"
        render={({ onClose }) => (
          <ModalBody onClose={onClose} flow={3}>
            <Text fontSize={4} color="steel">
              {t('receive.modalTitle')}
            </Text>
            <SelectAccount value={account} onChange={this.handleChangeAccount} />
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(ReceiveModal)
