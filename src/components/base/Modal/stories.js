// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'

import { Modal, ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

const stories = storiesOf('Components/base', module)

stories.add('Modal', () => {
  const isOpened = boolean('isOpened', true)
  return (
    <Modal
      isOpened={isOpened}
      render={({ onClose }) => (
        <ModalBody onClose={onClose}>
          <ModalTitle>{'modal title'}</ModalTitle>
          <ModalContent>{'this is the modal content'}</ModalContent>
          <ModalFooter horizontal align="center">
            <Box grow>{'modal footer'}</Box>
            <Button primary>{'Next'}</Button>
          </ModalFooter>
        </ModalBody>
      )}
    />
  )
})
