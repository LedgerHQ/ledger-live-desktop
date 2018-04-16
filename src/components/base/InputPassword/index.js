// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import zxcvbn from 'zxcvbn'

import type { T } from 'types/common'

import debounce from 'lodash/debounce'
import noop from 'lodash/noop'

import Box from 'components/base/Box'
import Input from 'components/base/Input'

import IconEye from 'icons/Eye'

const InputRight = styled(Box).attrs({
  color: 'grey',
  justifyContent: 'center',
  pr: 3,
})`
  cursor: pointer;
`

const Strength = styled(Box).attrs({
  bg: p => (p.activated ? (p.warning ? 'alertRed' : 'positiveGreen') : 'fog'),
  grow: true,
})`
  border-radius: 13px;
  height: 4px;
`

const Warning = styled(Box).attrs({
  alignItems: 'flex-end',
  color: p => (p.passwordStrength <= 1 ? 'alertRed' : 'positiveGreen'),
  ff: 'Open Sans|SemiBold',
  fontSize: 3,
})``

const getPasswordStrength = (v: string) => zxcvbn(v).score

type State = {
  inputType: 'text' | 'password',
  passwordStrength: number,
}

type Props = {
  maxLength: number,
  onChange: Function,
  t: T,
  value: string,
}

class InputPassword extends PureComponent<Props, State> {
  static defaultProps = {
    onChange: noop,
    value: '',
    maxLength: 20,
  }

  state = {
    passwordStrength: getPasswordStrength(this.props.value),
    inputType: 'password',
  }

  toggleInputType = () =>
    this.setState(prev => ({
      inputType: prev.inputType === 'text' ? 'password' : 'text',
    }))

  debouncePasswordStrength = debounce(
    v =>
      this.setState({
        passwordStrength: getPasswordStrength(v),
      }),
    150,
  )

  handleChange = (v: string) => {
    const { onChange } = this.props
    onChange(v)
    this.debouncePasswordStrength(v)
  }

  render() {
    const { t, value, maxLength } = this.props
    const { passwordStrength, inputType } = this.state

    const hasValue = value.trim() !== ''

    return (
      <Box flow={1}>
        <Input
          {...this.props}
          type={inputType}
          maxLength={maxLength}
          onChange={this.handleChange}
          renderRight={
            <InputRight onClick={this.toggleInputType}>
              <IconEye size={16} />
            </InputRight>
          }
        />
        <Box flow={1} horizontal>
          {[0, 1, 2, 3, 4].map(v => (
            <Strength
              key={v}
              warning={passwordStrength <= 1}
              activated={hasValue && passwordStrength >= v}
            />
          ))}
        </Box>
        {hasValue && (
          <Warning passwordStrength={passwordStrength}>
            {t(`password:warning_${passwordStrength}`)}
          </Warning>
        )}
      </Box>
    )
  }
}

export default translate()(InputPassword)
