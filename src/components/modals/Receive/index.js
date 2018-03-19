// @flow

import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'

import get from 'lodash/get'

import { MODAL_RECEIVE } from 'constants'

import Box from 'components/base/Box'
import Label from 'components/base/Label'
import Button from 'components/base/Button'
import Modal, { ModalBody, ModalTitle, ModalFooter, ModalContent } from 'components/base/Modal'
import ReceiveBox from 'components/ReceiveBox'
import RequestAmount from 'components/RequestAmount'
import SelectAccount from 'components/SelectAccount'

import type { Account as AccountType, T } from 'types/common'

type Props = {
  t: T,
}

type State = {
  account: AccountType | null,
  amount: Object,
}

const defaultState = {
  account: null,
  amount: {
    left: 0,
    right: 0,
  },
}

class ReceiveModal extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  getAccount(data) {
    const { account } = this.state

    return account || get(data, 'account')
  }

  handleChangeInput = key => value =>
    this.setState({
      [key]: value,
    })

  handleHide = () =>
    this.setState({
      ...defaultState,
    })

  _steps = [
    'receiveModal:Infos',
    'receiveModal:ConnectDevice',
    'receiveModal:SecureValidation',
    'receiveModal:Confirmation',
  ].map(v => ({ label: this.props.t(v) }))

  render() {
    const { t } = this.props
    const { amount } = this.state

    return (
      <Modal
        name={MODAL_RECEIVE}
        onHide={this.handleHide}
        render={({ data, onClose }) => {
          const account = this.getAccount(data)

          return (
            <ModalBody onClose={onClose} flow={3} deferHeight={282}>
              <ModalTitle>{t('receive:title')}</ModalTitle>
              <ModalContent>
                <Box flow={1}>
                  <Label>Account</Label>
                  <SelectAccount value={account} onChange={this.handleChangeInput('account')} />
                </Box>
                {account && (
                  <Fragment>
                    <Box flow={1}>
                      <Label>Request amount</Label>
                      <RequestAmount
                        account={account}
                        value={amount}
                        onChange={this.handleChangeInput('amount')}
                      />
                    </Box>
                    <ReceiveBox account={account} amount={amount.left} />
                  </Fragment>
                )}
              </ModalContent>
              <ModalFooter horizontal align="center" justify="flex-end">
                <Button primary onClick={onClose}>
                  {'Close'}
                </Button>
              </ModalFooter>
            </ModalBody>
          )
        }}
      />
    )
  }
}

export default translate()(ReceiveModal)
