// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import Modal, { ModalFooter } from 'components/base/Modal'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Box from 'components/base/Box'

const stories = storiesOf('Components/base', module)

stories.add('Modal', () => (
  <Modal
    title={text('title', 'Send funds')}
    isOpened={boolean('isOpened', true)}
    centered={boolean('centered', true)}
    onBack={action('onBack')}
    onClose={action('onClose')}
  >
    <Box flow={4}>
      <Box flow={2}>
        <Label>{'first field'}</Label>
        <Input autoFocus />
      </Box>
      <Box horizontal flow={4}>
        <Box flow={2} flex={1}>
          <Label>{'second field'}</Label>
          <Input />
        </Box>
        <Box flow={2} flex={1}>
          <Label>{'third field'}</Label>
          <Input />
        </Box>
      </Box>
      <Box horizontal flow={4}>
        <Box flow={2} flex={1}>
          <Label>{'second field'}</Label>
          <Input />
        </Box>
        <Box flow={2} flex={1}>
          <Label>{'third field'}</Label>
          <Input />
        </Box>
      </Box>
    </Box>
    <ModalFooter>footer</ModalFooter>
  </Modal>
))
