// @flow

import React, { Fragment, PureComponent } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import { MODAL_SEND } from 'constants'

import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Modal, { ModalBody } from 'components/base/Modal'
import SelectAccount from 'components/SelectAccount'

const Label = styled.label`
  display: block;
  text-transform: uppercase;
`

const Steps = {
  amount: (props: Object) => (
    <form
      onSubmit={(e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (
          !props.value.account ||
          props.value.address.trim() === '' ||
          props.value.amount.trim() === ''
        ) {
          return
        }

        props.onChangeStep('summary')
      }}
    >
      <div>amount</div>
      <div>
        <Label>Account to debit</Label>
        <SelectAccount onChange={props.onChangeInput('account')} value={props.value.account} />
      </div>
      <div>
        <Label>Recipient address</Label>
        <Input onChange={props.onChangeInput('address')} value={props.value.address} />
      </div>
      <div>
        <Label>Amount</Label>
        <Input onChange={props.onChangeInput('amount')} value={props.value.amount} />
      </div>
      <Button type="submit">Next</Button>
    </form>
  ),
  summary: (props: Object) => (
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

type Step = 'amount' | 'summary'

type State = {
  inputValue: InputValue,
  step: Step,
}

const defaultState = {
  inputValue: {
    account: null,
    address: '',
    amount: '',
  },
  step: 'amount',
}

class Send extends PureComponent<{}, State> {
  state = {
    ...defaultState,
  }

  getStepProps(data: any) {
    const { inputValue, step } = this.state

    const props = (predicate, props) => (predicate ? props : {})

    return {
      ...props(step === 'amount', {
        onChangeInput: this.handleChangeInput,
        value: {
          ...inputValue,
          account: inputValue.account || get(data, 'account'),
        },
      }),
      ...props(step === 'summary', {
        value: inputValue,
      }),
      onChangeStep: this.handleChangeStep,
    }
  }

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

  handleClose = () =>
    this.setState({
      ...defaultState,
    })

  render() {
    const { step } = this.state

    const Step = Steps[step]

    return (
      <Modal
        name={MODAL_SEND}
        onClose={this.handleClose}
        render={({ data, onClose }) => (
          <Fragment>
            <ModalBody>{step}</ModalBody>
            <ModalBody onClose={onClose}>
              <Step {...this.getStepProps(data)} />
            </ModalBody>
          </Fragment>
        )}
      />
    )
  }
}

export default Send
