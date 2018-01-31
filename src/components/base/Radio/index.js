// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const Base = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  relative: true,
})`
  box-shadow: 0 0 0 ${p => (p.checked ? 4 : 1)}px
    ${p => (p.checked ? p.theme.colors.cream : p.theme.colors.argile)};
  border-radius: 50%;
  height: 19px;
  width: 19px;
  transition: all ease-in-out 0.1s;

  input[type='radio'] {
    bottom: 0;
    cursor: pointer;
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 10;
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
    background-color: ${p => p.theme.colors.blue};
    ${p =>
      p.checked &&
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
      p.checked &&
      `
      bottom: 7px;
      left: 7px;
      right: 7px;
      top: 7px;
    `};
  }
`

type Props = {
  checked: boolean,
  onChange?: Function,
}

type State = {
  checked: boolean,
}

class Radio extends PureComponent<Props, State> {
  static defaultProps = {
    checked: false,
  }

  state = {
    checked: this.props.checked,
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      checked: nextProps.checked,
    })
  }

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    const { checked } = e.target

    this.setState({
      checked,
    })

    if (onChange) {
      onChange(checked)
    }
  }

  render() {
    const { checked } = this.state
    const { onChange, ...props } = this.props

    return (
      <Base {...props} checked={checked}>
        <input type="radio" checked={checked} onChange={this.handleChange} />
      </Base>
    )
  }
}

export default Radio
