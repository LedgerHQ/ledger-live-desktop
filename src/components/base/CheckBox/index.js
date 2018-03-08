// @flow

import React from 'react'
import noop from 'lodash/noop'
import styled, { keyframes } from 'styled-components'

import { Tabbable } from 'components/base/Box'
import IconCheck from 'icons/Check'

const bounce = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
`

const Base = styled(Tabbable).attrs({
  color: 'white',
  alignItems: 'center',
  justifyContent: 'center',
})`
  cursor: pointer;
  outline: none;
  border-radius: 3px;
  border: 1px solid transparent;
  background-color: ${p => (p.isChecked ? p.theme.colors.wallet : p.theme.colors.white)};
  box-shadow: 0 0 0 ${p => (p.isChecked ? 4 : 1)}px
    ${p => (p.isChecked ? p.theme.colors.lightGrey : p.theme.colors.graphite)};
  font-size: 7px;
  height: 19px;
  width: 19px;
  transition: all ease-in 0.1s;

  &:focus {
    border-color: ${p => p.theme.colors.fog};
  }
`

const IconWrapper = styled(IconCheck)`
  animation: ${bounce} ease-in-out 350ms;
`

type Props = {
  isChecked: boolean,
  onChange?: Function,
}

function CheckBox(props: Props) {
  const { isChecked, onChange, ...p } = props
  return (
    <Base isChecked={isChecked} onClick={() => onChange && onChange(!isChecked)} {...p}>
      {isChecked && <IconWrapper height={7} width={7} />}
    </Base>
  )
}

CheckBox.defaultProps = {
  onChange: noop,
}

export default CheckBox
