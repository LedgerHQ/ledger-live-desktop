// @flow

import React, { PureComponent } from 'react'

import Text from 'components/base/Text'
import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import { getDeviceModel } from '@ledgerhq/devices'
import type { Device, MemoryInfos } from 'types/common'

import MemInfos from './MemInfos'

type Props = {
  device: Device,
}

type State = {
  memoryInfos: ?MemoryInfos,
  isLoading: boolean,
}

class DeviceInfos extends PureComponent<Props, State> {
  state = {
    isLoading: false,
    memoryInfos: null,
  }

  handleGetMemInfos = async () => {
    try {
      this.setState({ isLoading: true })
      const memoryInfos = null // TODO
      this.setState({ memoryInfos, isLoading: false })
    } catch (err) {
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { device } = this.props
    const { memoryInfos, isLoading } = this.state

    if (!device) {
      return <Box py={5}>{'You dont have any device connected'}</Box>
    }

    const deviceInfos = getDeviceModel(device.modelId)

    const title = (
      <Text>
        <Text ff="Inter|Bold">{`${deviceInfos.productName}`}</Text>
      </Text>
    )
    return (
      <Card title={title} p={6}>
        {memoryInfos ? (
          <MemInfos memoryInfos={memoryInfos} />
        ) : (
          <Box flow={2}>
            <Box horizontal>
              <Button primary onClick={this.handleGetMemInfos} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Read device memory'}
              </Button>
            </Box>
            {isLoading && <Box>{'If asked, confirm operation on device'}</Box>}
          </Box>
        )}
      </Card>
    )
  }
}

export default DeviceInfos
