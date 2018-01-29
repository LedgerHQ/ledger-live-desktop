// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Icon from 'components/base/Icon'

const Base = styled(Box).attrs({
  align: 'center',
  justify: 'center',
  relative: true,
})`
  background-color: ${p => (p.checked ? p.theme.colors.blue : p.theme.colors.white)};
  box-shadow: 0 0 0 ${p => (p.checked ? 4 : 1)}px
    ${p => (p.checked ? p.theme.colors.cream : p.theme.colors.argile)};
  border-radius: 50%;
  font-size: 7px;

  height: 19px;
  width: 19px;
  transition: all ease-in-out 0.1s;

  input[type='checkbox'] {
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

  > span {
    position: relative;
    top: 1px;
    opacity: ${p => (p.checked ? 1 : 0)};
    transition: all ease-in-out 0.1s;
  }
`

type Props = {
  checked?: boolean,
  onChange?: Function,
}

type State = {
  checked: boolean,
}

class Checkbox extends PureComponent<Props, State> {
  state = {
    checked: this.props.checked || false,
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.checked) {
      this.setState({
        checked: nextProps.checked,
      })
    }
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
      <Base {...props}>
        <input type="checkbox" checked={checked} onChange={this.handleChange} />
        <Icon color="white" name="check" />
      </Base>
    )
  }
}

export default Checkbox
