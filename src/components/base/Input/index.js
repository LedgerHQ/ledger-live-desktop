// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { space, fontSize } from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

const Base = styled.input.attrs({
  px: 3,
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
})`
  ${space};
  ${fontFamily};
  ${fontSize};
  height: 40px;
  border: 1px solid ${p => p.theme.colors.fog};
  border-radius: 3px;
  display: flex;
  width: 100%;
  color: ${p => p.theme.colors.graphite};
  background: ${p => p.theme.colors.white};

  &::placeholder {
    color: ${p => p.theme.colors.fog};
  }

  &:focus {
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  }
`

type Props = {
  onChange?: Function,
  keepEvent?: boolean,
}

class Input extends PureComponent<Props> {
  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange, keepEvent } = this.props

    if (onChange) {
      onChange(keepEvent ? e : e.target.value)
    }
  }

  render() {
    return <Base {...this.props} onChange={this.handleChange} />
  }
}

export default Input
