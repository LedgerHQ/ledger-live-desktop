// @flow

import React from 'react'
import noop from 'lodash/noop'
import styled from 'styled-components'

import { Tabbable } from 'components/base/Box'

const Base = styled(Tabbable).attrs({
  bg: p => (p.isChecked ? 'wallet' : 'fog'),
  horizontal: true,
  align: 'center',
})`
  backround: red;
  width: 50px;
  height: 24px;
  border-radius: 16px;
  transition: 250ms linear background-color;
  cursor: pointer;
  &:focus {
    box-shadow: rgba(0, 0, 0, 0.1) 0 2px 2px;
    outline: none;
  }
`

const Ball = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
  transition: 250ms ease-in-out transform;
  transform: translate3d(${p => (p.isChecked ? '28px' : '0')}, 0, 0);
`

type Props = {
  isChecked: boolean,
  onChange?: Function,
}

function CheckBox(props: Props) {
  const { isChecked, onChange, ...p } = props
  return (
    <Base isChecked={isChecked} onClick={() => onChange && onChange(!isChecked)} {...p}>
      <Ball isChecked={isChecked} />
    </Base>
  )
}

CheckBox.defaultProps = {
  onChange: noop,
}

export default CheckBox
