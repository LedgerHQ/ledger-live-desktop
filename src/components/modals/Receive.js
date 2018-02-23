// @flow

import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'
import get from 'lodash/get'

import { MODAL_RECEIVE } from 'constants'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Modal, { ModalBody } from 'components/base/Modal'
import ReceiveBox from 'components/ReceiveBox'
import SelectAccount from 'components/SelectAccount'
import Text from 'components/base/Text'

import type { Account as AccountType, T } from 'types/common'

type Props = {
  t: T,
}

type State = {
  account: AccountType | null,
  amount: string,
}

const defaultState = {
  account: null,
  amount: '',
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

  render() {
    const { amount } = this.state
    const { t } = this.props

    return (
      <Modal
        name={MODAL_RECEIVE}
        onHide={this.handleHide}
        render={({ data, onClose }) => {
          const account = this.getAccount(data)

          return (
            <ModalBody onClose={onClose} flow={3}>
              <Text fontSize={4} color="graphite">
                {t('receive.title')}
              </Text>
              <Box flow={1}>
                <Label>Account</Label>
                <SelectAccount value={account} onChange={this.handleChangeInput('account')} />
              </Box>
              {account && (
                <Fragment>
                  <Box flow={1}>
                    <Label>Request amount</Label>
                    <Input
                      type="number"
                      min={0}
                      max={account.balance / 1e8}
                      onChange={this.handleChangeInput('amount')}
                    />
                  </Box>
                  <ReceiveBox path={account.path} amount={amount} address={account.address || ''} />
                </Fragment>
              )}
              <Box horizontal justifyContent="center">
                <Button primary onClick={onClose}>
                  Close
                </Button>
              </Box>
            </ModalBody>
          )
        }}
      />
    )
  }
}

export default translate()(ReceiveModal)
