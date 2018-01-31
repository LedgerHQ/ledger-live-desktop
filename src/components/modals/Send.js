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
import RecipientAddress from 'components/RecipientAddress'
import SelectAccount from 'components/SelectAccount'
import Text from 'components/base/Text'

const Steps = {
  amount: ({ t, ...props }: Object) => (
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
      <Box flow={3}>
        <Text fontSize={4} color="steel">
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
        <Box horizontal align="center">
          <Box grow>
            <Text>Cancel</Text>
          </Box>
          <Box justify="flex-end">
            <Button type="submit" primary>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
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

type Props = {
  t: T,
}

const defaultState = {
  inputValue: {
    account: null,
    address: '',
    amount: '',
  },
  step: 'amount',
}

class Send extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  getStepProps(data: any) {
    const { inputValue, step } = this.state
    const { t } = this.props

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
      t,
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

export default translate()(Send)
