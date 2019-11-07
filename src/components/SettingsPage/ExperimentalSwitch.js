// @flow

import React, { PureComponent } from 'react'

import Track from 'analytics/Track'
import Switch from 'components/base/Switch'

type Props = {
  name: string,
  valueOn: mixed,
  valueOff: mixed,
  isDefault: boolean,
  readOnly: boolean,
  onChange: (name: string, val: mixed) => boolean,
}

export default class ExperimentalSwitch extends PureComponent<Props, { checked: boolean }> {
  static defaultProps = {
    valueOn: true,
    valueOff: false,
  }
  state = {
    checked: !this.props.isDefault,
  }

  onChange = (evt: boolean) => {
    const { onChange, valueOn, valueOff, name } = this.props
    onChange(name, evt ? valueOn : valueOff)
    this.setState({ checked: evt })
  }

  render() {
    const { name, readOnly } = this.props
    const { checked } = this.state
    return (
      <>
        <Track onUpdate event={checked ? `${name}Enabled` : `${name}Disabled`} />
        <Switch
          disabled={readOnly}
          isChecked={checked}
          onChange={readOnly ? null : this.onChange}
          data-e2e={`${name}_button`}
        />
      </>
    )
  }
}
