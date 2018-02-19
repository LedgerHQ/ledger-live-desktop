// @flow

import React, { Fragment, PureComponent } from 'react'
import { translate } from 'react-i18next'
import get from 'lodash/get'

import type { T } from 'types/common'

import { MODAL_SEND } from 'constants'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Modal, { ModalBody } from 'components/base/Modal'
import Breadcrumb from 'components/Breadcrumb'
import RecipientAddress from 'components/RecipientAddress'
import SelectAccount from 'components/SelectAccount'
import Text from 'components/base/Text'

const Steps = {
  '1': ({ t, ...props }: Object) => (
    <form
      onSubmit={(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (props.canSubmit) {
          props.onChangeStep('2')
        }
      }}
    >
      <Box flow={3}>
        <Text fontSize={6} color="steel">
          {t('send.title')}
        </Text>
        <Box flow={1}>
          <Label>Account to debit</Label>
          <SelectAccount onChange={props.onChangeInput('account')} value={props.value.account} />
        </Box>
        <Box flow={1}>
          <Label>Recipient address</Label>
          <RecipientAddress onChange={props.onChangeInput('address')} value={props.value.address} />
        </Box>
        <Box flow={1}>
          <Label>Amount</Label>
          <Input onChange={props.onChangeInput('amount')} value={props.value.amount} />
        </Box>
        <Box horizontal alignItems="center">
          <Box grow>
            <Text>Cancel</Text>
          </Box>
          <Box justifyContent="flex-end">
            <Button type="submit" primary disabled={!props.canSubmit}>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  ),
  '2': (props: Object) => (
    <div>
      <div>summary</div>
      <div>{props.value.amount}</div>
      <div>to {props.value.address}</div>
      <div>from {props.value.account.name}</div>
    </div>
  ),
}

type InputValue = {
  account: any,
  address: string,
  amount: string,
}

type Step = '1' | '2'

type State = {
  inputValue: InputValue,
  step: Step,
}

type Props = {
  t: T,
}

const defaultState = {
  inputValue: {
    account: null,
    address: '',
    amount: '',
  },
  step: '1',
}

class Send extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  componentWillMount() {
    const { t } = this.props
    this._items = [
      { label: t('sendModal.Amount') },
      { label: t('sendModal.Summary') },
      { label: t('sendModal.SecureValidation') },
      { label: t('sendModal.Confirmation') },
    ]
  }

  getStepProps(data: any) {
    const { inputValue, step } = this.state
    const { t } = this.props

    const props = (predicate, props, defaults = {}) => (predicate ? props : defaults)

    const account = inputValue.account || get(data, 'account')

    return {
      ...props(step === '1', {
        canSubmit: account && inputValue.address.trim() !== '' && inputValue.amount.trim() !== '',
        onChangeInput: this.handleChangeInput,
        value: {
          ...inputValue,
          account,
        },
      }),
      ...props(step === '2', {
        value: {
          ...inputValue,
          account,
        },
      }),
      onChangeStep: this.handleChangeStep,
      t,
    }
  }

  _items = []

  handleChangeInput = (key: $Keys<InputValue>) => (value: $Values<InputValue>) =>
    this.setState(prev => ({
      inputValue: {
        ...prev.inputValue,
        [key]: value,
      },
    }))

  handleChangeStep = (step: Step) =>
    this.setState({
      step,
    })

  handleHide = () =>
    this.setState({
      ...defaultState,
    })

  render() {
    const { step } = this.state

    return (
      <Modal
        name={MODAL_SEND}
        onHide={this.handleHide}
        render={({ data, onClose }) => {
          const Step = Steps[step]

          return (
            <Fragment>
              <ModalBody p={3}>
                <Breadcrumb currentStep={step} items={this._items} />
              </ModalBody>
              <ModalBody onClose={onClose}>
                <Step {...this.getStepProps(data)} />
              </ModalBody>
            </Fragment>
          )
        }}
      />
    )
  }
}

export default translate()(Send)
