// @flow

import React from 'react'
import noop from 'lodash/noop'
import styled from 'styled-components'

import { Tabbable } from 'components/base/Box'

const Base = styled(Tabbable).attrs({
  bg: p => (p.isChecked ? 'wallet' : 'lightFog'),
  horizontal: true,
  align: 'center',
})`
  backround: red;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  transition: 250ms linear background-color;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`

const Ball = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  transition: 250ms ease-in-out transform;
  transform: translate3d(${p => (p.isChecked ? '27px' : '3px')}, 0, 0);
`

type Props = {
  isChecked: boolean,
  onChange?: Function,
}

function Switch(props: Props) {
  const { isChecked, onChange, ...p } = props
  return (
    <Base isChecked={isChecked} onClick={() => onChange && onChange(!isChecked)} {...p}>
      <Ball isChecked={isChecked} />
    </Base>
  )
}

Switch.defaultProps = {
  onChange: noop,
}

export default Switch
