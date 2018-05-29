// @flow

import React from 'react'
import styled from 'styled-components'

import { Tabbable } from 'components/base/Box'

const Base = styled(Tabbable).attrs({ relative: true })`
  outline: none;
  box-shadow: 0 0 0 1px ${p => (p.isChecked ? p.theme.colors.lightGrey : p.theme.colors.fog)};
  border-radius: 50%;
  height: 19px;
  width: 19px;
  transition: all ease-in-out 0.1s;
  background-color: white;

  &:focus {
    box-shadow: 0 0 0 ${p => (p.isChecked ? 4 : 2)}px
      ${p => (p.isChecked ? p.theme.colors.lightGrey : p.theme.colors.fog)};
  }

  &:before,
  &:after {
    border-radius: 50%;
    bottom: 100%;
    content: ' ';
    left: 100%;
    position: absolute;
    right: 100%;
    top: 100%;
    transition: all ease-in-out 0.2s;
  }

  &:before {
    background-color: ${p => p.theme.colors.wallet};
    ${p =>
      p.isChecked &&
      `
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
    `};
  }

  &:after {
    background-color: ${p => p.theme.colors.white};
    ${p =>
      p.isChecked &&
      `
      bottom: 7px;
      left: 7px;
      right: 7px;
      top: 7px;
    `};
  }
`

type Props = {
  isChecked: boolean,
  onChange?: Function,
}

function Radio(props: Props) {
  const { isChecked, onChange } = props
  return <Base {...props} isChecked={isChecked} onClick={() => onChange && onChange(!isChecked)} />
}

Radio.defaultProps = {
  onChange: null,
}

export default Radio
