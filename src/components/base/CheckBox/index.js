// @flow

import React from 'react'
import styled from 'styled-components'

import Check from 'icons/Check'
import { Tabbable } from 'components/base/Box'

const Base = styled(Tabbable).attrs(() => ({
  relative: true,
  align: 'center',
  justifyContent: 'center',
}))`
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${p =>
    p.isChecked ? p.theme.colors.wallet : p.theme.colors.palette.background.paper};
  border: 1px solid
    ${p => (p.isChecked ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider)};
  color: ${p =>
    p.isChecked
      ? p.theme.colors.palette.primary.contrastText
      : p.theme.colors.palette.background.paper};
  height: 18px;
  width: 18px;
  transition: all ease-in-out 0.1s;
  &:focus {
    box-shadow: 0 0 4px 1px ${p => p.theme.colors.wallet};
    border-color: ${p => p.theme.colors.wallet};
  }
  &:hover {
    border-color: ${p => p.theme.colors.wallet};
  }
`

type Props = {
  isChecked: boolean,
  onChange?: Function,
}

function CheckBox(props: Props) {
  const { isChecked, onChange } = props
  return (
    <Base {...props} isChecked={isChecked} onClick={() => onChange && onChange(!isChecked)}>
      <Check size={12} />
    </Base>
  )
}

export default CheckBox
