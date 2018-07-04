// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'

import {
  Modal,
  ModalBody,
  ModalTitle,
  ModalContent,
  ModalFooter,
  ConfirmModal,
} from 'components/base/Modal'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

const stories = storiesOf('Components/base', module)

stories.add('Modal', () => (
  <Modal
    isOpened={boolean('isOpened', true)}
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
))

stories.add('ConfirmModal', () => (
  <ConfirmModal
    categoryName=""
    isOpened
    isDanger={boolean('isDanger', false)}
    title={text('title', 'Hard reset')}
    subTitle={text('subTitle', 'Are you sure houston?')}
    desc={text(
      'desc',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non nibh diam. In eget ipsum arcu donec finibus',
    )}
    onConfirm={action('onConfirm')}
    onReject={action('onReject')}
  />
))
