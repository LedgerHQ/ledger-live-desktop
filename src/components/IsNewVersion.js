// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'
import semver from 'semver'

import type { State } from 'reducers'
import { openModal } from 'reducers/modals'
import { lastUsedVersionSelector } from 'reducers/settings'
import { saveSettings } from 'actions/settings'
import { MODAL_RELEASES_NOTES } from 'config/constants'

type Props = {
  openModal: Function,
  saveSettings: Function,
  lastUsedVersion: string,
}

const mapStateToProps = (state: State) => ({
  lastUsedVersion: lastUsedVersionSelector(state),
})

const mapDispatchToProps = {
  openModal,
  saveSettings,
}

class IsNewVersion extends PureComponent<Props> {
  componentDidMount() {
    const { lastUsedVersion, saveSettings, openModal } = this.props
    const currentVersion = __APP_VERSION__

    if (semver.gt(currentVersion, lastUsedVersion)) {
      openModal(MODAL_RELEASES_NOTES, currentVersion)
      saveSettings({ lastUsedVersion: currentVersion })
    }
  }

  render() {
    return null
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IsNewVersion)
