// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { space } from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

const Base = styled.input.attrs({
  p: 4,
  ff: 'Open Sans|SemiBold',
})`
  ${space};
  ${fontFamily};
  border: 1px solid ${p => p.theme.colors.mouse};
  border-radius: 3px;
  display: flex;
  width: 100%;
  color: ${p => p.theme.colors.graphite};
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
