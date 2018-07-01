// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setDeveloperMode } from 'actions/settings'
import { developerModeSelector } from 'reducers/settings'
import Track from 'analytics/Track'
import CheckBox from 'components/base/CheckBox'

const mapStateToProps = createStructuredSelector({
  developerMode: developerModeSelector,
})

const mapDispatchToProps = {
  setDeveloperMode,
}

type Props = {
  developerMode: boolean,
  setDeveloperMode: boolean => void,
}

class DevModeButton extends PureComponent<Props> {
  render() {
    const { developerMode, setDeveloperMode } = this.props
    return (
      <Fragment>
        <Track onUpdate event={developerMode ? 'DevModeEnabled' : 'DevModeDisabled'} />
        <CheckBox isChecked={developerMode} onChange={setDeveloperMode} />
      </Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DevModeButton)
