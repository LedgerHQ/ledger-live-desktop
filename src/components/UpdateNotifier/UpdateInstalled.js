// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'

import { openModal } from 'reducers/modals'
import { MODAL_RELEASES_NOTES } from 'config/constants'
import { lastUsedVersionSelector } from 'reducers/settings'
import type { State } from 'reducers'

type Props = {
  openModal: Function,
  lastUsedVersion: string,
}

const mapStateToProps = (state: State) => ({
  lastUsedVersion: lastUsedVersionSelector(state),
})

const mapDispatchToProps = {
  openModal,
}

class UpdateInstalled extends PureComponent<Props> {
  componentDidMount() {
    const { lastUsedVersion, openModal } = this.props
    const currentVersion = __APP_VERSION__

    openModal(MODAL_RELEASES_NOTES, `${lastUsedVersion} -> ${currentVersion}`)
  }

  render() {
    return null
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateInstalled)
