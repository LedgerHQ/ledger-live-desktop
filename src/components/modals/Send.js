// @flow

import React, { Fragment, PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'
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

const BreadcrumbWrapper = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  flow: 20,
  relative: true,
})``
const BreadcrumbStep = styled(({ start, active, end, ...props }) => (
  <Box start={start} end={end} active={active} {...props} />
)).attrs({
  color: p => (p.active ? 'blue' : 'mouse'),
  align: 'center',
  flow: 5,
  grow: p => !p.start && !p.end,
  ml: p => p.end && 20,
  mr: p => p.start && 20,
})`
  &:before {
    content: ' ';
    display: block;
    height: 2px;
    position: absolute;
    left: 20px;
    right: 20px;
    background: ${p => p.theme.colors.pearl};
    margin-top: 8px;
  }
`
const BreadcrumbNumberWrapper = styled(Box).attrs({
  bg: 'white',
  px: 3,
  relative: true,
})`
  z-index: 1;
`
const BreadcrumbNumber = styled(Box).attrs({
  color: p => (p.active ? 'white' : 'mouse'),
  bg: p => (p.active ? 'blue' : 'pearl'),
  align: 'center',
  justify: 'center',
})`
  border-radius: 50%;
  box-shadow: ${p => p.active && `0 0 0 4px ${p.theme.colors.cream}`};
  font-size: 9px;
  height: 20px;
  width: 20px;
`

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
            <ModalBody p={2}>
              <Breadcrumb
                currentStep={step}
                items={[
                  { label: 'Amount' },
                  { label: 'Summary' },
                  { label: 'Secure validation' },
                  { label: 'Confirmation' },
                ]}
              />
            </ModalBody>
            <ModalBody onClose={onClose}>
              <Step {...this.getStepProps(data)} />
            </ModalBody>
          </Fragment>
        )}
      />
    )
  }
}

const Breadcrumb = ({ items, currentStep }: Object) => (
  <BreadcrumbWrapper>
    {items.map((item, i) => {
      const active = i < currentStep
      const start = i === 0
      const end = i + 1 === items.length
      return (
        <BreadcrumbStep
          key={i} // eslint-disable-line react/no-array-index-key
          start={start}
          end={end}
          active={active}
        >
          <BreadcrumbNumberWrapper>
            <BreadcrumbNumber active={active}>{i + 1}</BreadcrumbNumber>
          </BreadcrumbNumberWrapper>
          <Box fontSize={0}>{item.label}</Box>
        </BreadcrumbStep>
      )
    })}
  </BreadcrumbWrapper>
)

export default translate()(Send)
