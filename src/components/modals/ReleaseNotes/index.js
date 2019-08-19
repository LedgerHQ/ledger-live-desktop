// @flow

import React from 'react'

import { MODAL_RELEASES_NOTES } from 'config/constants'
import Modal from 'components/base/Modal'

import ReleaseNotesBody from './ReleaseNotesBody'

export default () => (
  <Modal
    name={MODAL_RELEASES_NOTES}
    centered
    render={({ data, onClose }) => <ReleaseNotesBody version={data} onClose={onClose} />}
  />
)
