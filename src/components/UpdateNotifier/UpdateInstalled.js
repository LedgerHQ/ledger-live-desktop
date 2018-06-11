// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'

import { openModal } from 'reducers/modals'
import { MODAL_RELEASES_NOTES } from 'config/constants'

type Props = {
  openModal: Function,
}

const mapDispatchToProps = {
  openModal,
}

class UpdateInstalled extends PureComponent<Props> {
  componentDidMount() {
    const { openModal } = this.props

    openModal(MODAL_RELEASES_NOTES, 'blah')
  }

  render() {
    return null
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(UpdateInstalled)
