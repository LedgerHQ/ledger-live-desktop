// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import semver from 'semver'

import type { State } from 'reducers'
import { openModal } from 'reducers/modals'
import { lastUsedVersionSelector } from 'reducers/settings'
import { saveSettings } from 'actions/settings'
import { MODAL_RELEASES_NOTES } from 'config/constants'
import Modal from 'components/base/Modal'

import ReleaseNotesBody from './ReleaseNotesBody'

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

class ReleaseNotesModal extends PureComponent<Props> {
  componentDidMount() {
    const { lastUsedVersion, saveSettings, openModal } = this.props
    const currentVersion = __APP_VERSION__

    if (semver.gt(currentVersion, lastUsedVersion)) {
      openModal(MODAL_RELEASES_NOTES, currentVersion)
      saveSettings({ lastUsedVersion: currentVersion })
    }
  }

  render() {
    return (
      <Modal
        name={MODAL_RELEASES_NOTES}
        render={({ data, onClose }) => <ReleaseNotesBody version={data} onClose={onClose} />}
      />
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReleaseNotesModal)
