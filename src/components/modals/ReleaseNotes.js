// @flow
import React, { PureComponent } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

import { MODAL_RELEASES_NOTES } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

const Notes = styled(Box).attrs({
  ff: 'Open Sans',
  fontSize: 4,
  color: 'smoke',
  flow: 4,
})``

const Title = styled(Text).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  color: 'dark',
})``

class ReleaseNotes extends PureComponent<*, *> {
  render() {
    const renderBody = ({ data, onClose }) => {
      const { name, body: markdown } = data

      return (
        <ModalBody onClose={onClose}>
          <ModalTitle>Release Notes</ModalTitle>
          <ModalContent>
            <Notes>
              <Title>Version {name}</Title>
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </Notes>
          </ModalContent>
        </ModalBody>
      )
    }

    return <Modal name={MODAL_RELEASES_NOTES} render={renderBody} />
  }
}

export default ReleaseNotes
