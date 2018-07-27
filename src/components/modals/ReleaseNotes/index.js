// @flow
import React from 'react'

import { MODAL_RELEASES_NOTES } from 'config/constants'
import Modal from 'components/base/LegacyModal'

import ReleaseNotesBody from './ReleaseNotesBody'

const ReleaseNotesModal = () => (
  <Modal
    name={MODAL_RELEASES_NOTES}
    render={({ data, onClose }) => <ReleaseNotesBody version={data} onClose={onClose} />}
  />
)

export default ReleaseNotesModal
