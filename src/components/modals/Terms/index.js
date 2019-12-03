// @flow
import React from 'react'
import Modal from 'components/base/Modal'
import Body from './Body'

export default () => (
  <Modal
    name="MODAL_TERMS"
    preventBackdropClick
    centered
    render={({ onClose }) => <Body onClose={onClose} />}
  />
)
