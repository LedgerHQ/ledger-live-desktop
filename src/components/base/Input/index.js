// @flow

import React, { PureComponent } from 'react'

import styled from 'styled-components'

const Base = styled.input`
  padding: 10px 15px;
  border: 1px solid ${p => p.theme.colors.mouse};
  border-radius: 3px;
  display: flex;
  width: 100%;
  color: ${p => p.theme.colors.steel};
  background: ${p => p.theme.colors.white};

  &::placeholder {
    color: ${p => p.theme.colors.mouse};
  }

  &:focus {
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  }
`

type Props = {
  onChange: Function,
}

export default class Input extends PureComponent<Props> {
  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props

    onChange(e.target.value)
  }

  render() {
    return <Base {...this.props} onChange={this.handleChange} />
  }
}
