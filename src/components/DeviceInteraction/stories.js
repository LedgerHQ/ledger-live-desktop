// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import DeviceInteraction from 'components/DeviceInteraction'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

import IconUsb from 'icons/Usb'

const stories = storiesOf('Components', module)

stories.add('DeviceInteraction', () => <Wrapper />)

const MockIcon = styled.div`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  background: ${p => p.theme.colors.palette.text.shade40};
  border-radius: 50%;
`

const mockIcon = <MockIcon size={26} />

class Wrapper extends React.Component<any> {
  _ref = null
  handleReset = () => this._ref && this._ref.reset()
  render() {
    return (
      <Fragment>
        <button style={{ marginBottom: 40 }} onClick={this.handleReset}>
          {'reset'}
        </button>
        <DeviceInteraction
          shouldRenderRetry
          ref={n => (this._ref = n)}
          steps={[
            {
              id: 'deviceOpen',
              title: ({ deviceConnect: device }) =>
                `Open the Bitcoin application on your ${device ? `${device.name} ` : ''}device`,
              desc: 'To be able to retriev your Bitcoins',
              icon: mockIcon,
              run: () => new Promise(resolve => setTimeout(resolve, 1 * 1000)),
            },
            {
              id: 'deviceConnect',
              title: 'Connect your device',
              icon: <IconUsb size={26} />,
              render: ({ onSuccess, onFail }) => (
                <Box p={2} bg="palette.background.default" mt={2} borderRadius={1}>
                  <Box horizontal flow={2}>
                    <Button small primary onClick={() => onSuccess({ name: 'Nano S' })}>
                      {'Nano S'}
                    </Button>
                    <Button small primary onClick={() => onSuccess({ name: 'Blue' })}>
                      {'Blue'}
                    </Button>
                    <Button small danger onClick={onFail}>
                      {'make it fail'}
                    </Button>
                  </Box>
                </Box>
              ),
            },
            {
              id: 'check',
              title: 'Checking if all is alright...',
              desc: 'This should take only 1 second...',
              icon: mockIcon,
              run: () => new Promise(resolve => setTimeout(resolve, 1 * 1000)),
            },
          ]}
          onSuccess={action('onSuccess')}
        />
      </Fragment>
    )
  }
}
