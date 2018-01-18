// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'
import type { Accounts } from 'types/common'

import { getAccounts } from 'reducers/accounts'

import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Modal from 'components/base/Modal'
import Select from 'components/base/Select'

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
          props.value.account.trim() === '' ||
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
        <Select
          onChange={item => props.onChangeInput('account')(item.key)}
          renderSelected={item => item.name}
          items={Object.entries(props.accounts).map(([id, account]: [string, any]) => ({
            key: id,
            name: account.name,
          }))}
        />
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
      <div>from {props.account.name}</div>
    </div>
  ),
}

type InputValue = {
  account: string,
  address: string,
  amount: string,
}

type Step = 'amount' | 'summary'

type Props = {
  accounts: Accounts,
}
type State = {
  inputValue: InputValue,
  step: Step,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getAccounts(state),
})

const defaultState = {
  inputValue: {
    account: '',
    address: '',
    amount: '',
  },
  step: 'amount',
}

class Send extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  getStepProps() {
    const { accounts } = this.props
    const { inputValue, step } = this.state

    const props = (predicate, props) => (predicate ? props : {})

    return {
      ...props(step === 'amount', {
        accounts,
        onChangeInput: this.handleChangeInput,
        value: inputValue,
      }),
      ...props(step === 'summary', {
        account: accounts[inputValue.account],
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

  handleChangeStep = step =>
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
      <Modal name="send" onClose={this.handleClose}>
        <Step {...this.getStepProps()} />
      </Modal>
    )
  }
}

export default connect(mapStateToProps)(Send)
