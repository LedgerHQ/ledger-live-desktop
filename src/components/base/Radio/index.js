// @flow

import React from 'react'
import styled from 'styled-components'

import { Tabbable } from 'components/base/Box'

const Base = styled(Tabbable).attrs(() => ({ relative: true }))`
  outline: none;
  box-shadow: 0 0 0 1px
    ${p =>
      p.isChecked ? p.theme.colors.palette.background.default : p.theme.colors.palette.divider};
  border-radius: 50%;
  height: 19px;
  width: 19px;
  transition: all ease-in-out 0.1s;
  background-color: ${p => p.theme.colors.palette.background.paper};

  &:focus {
    box-shadow: 0 0 0 ${p => (p.isChecked ? 4 : 2)}px
      ${p =>
        p.isChecked ? p.theme.colors.palette.background.default : p.theme.colors.palette.divider};
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
    background-color: ${p => p.theme.colors.palette.background.paper};
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

export default Radio
