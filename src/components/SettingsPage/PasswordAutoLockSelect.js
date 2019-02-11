// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { setAutoLockTimeout, saveSettings } from 'actions/settings'
import Select from 'components/base/Select'
import type { T } from 'types/common'
import { autoLockTimeoutSelector } from 'reducers/settings'

type Props = {
  autoLockTimeout: string,
  setAutoLockTimeout: (?number) => void,
  t: T,
}

const mapStateToProps = createStructuredSelector({
  autoLockTimeout: autoLockTimeoutSelector,
})

const mapDispatchToProps = {
  saveSettings,
  setAutoLockTimeout,
}

class PasswordAutoLockSelect extends PureComponent<Props> {
  handleChangeTimeout = ({ value: timeoutKey }: *) => {
    this.props.setAutoLockTimeout(+timeoutKey)
  }

  timeouts = [
    { value: 1, label: `1 ${this.props.t('time.minute')}` },
    { value: 10, label: `10 ${this.props.t('time.minute')}s` },
    { value: 30, label: `30 ${this.props.t('time.minute')}s` },
    { value: 60, label: `1 ${this.props.t('time.hour')}` },
    { value: -1, label: this.props.t(`app:common.never`) },
  ]

  render() {
    const { autoLockTimeout } = this.props
    const currentTimeout = this.timeouts.find(l => l.value === autoLockTimeout)

    return (
      <Select
        small
        minWidth={250}
        isSearchable={false}
        onChange={this.handleChangeTimeout}
        renderSelected={item => item && item.name}
        value={currentTimeout}
        options={this.timeouts}
      />
    )
  }
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PasswordAutoLockSelect),
)
