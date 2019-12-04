// @flow

import React from 'react'
import { distribute, formatSize } from '@ledgerhq/live-common/lib/apps'
import styled from 'styled-components'
import IconWarning from 'icons/TriangleWarning'
import { Trans } from 'react-i18next'

import IconCheck from 'icons/Check'
import Tooltip from 'components/base/Tooltip'
import Card from 'components/base/Box/Card'

import Text from 'components/base/Text'
import Box from 'components/base/Box'
import nanoS from './images/nanoS.png'
import nanoX from './images/nanoX.png'
import blue from './images/blue.png'
import { rgba } from '../../../styles/helpers'

const illustrations = {
  nanoS,
  nanoX,
  blue,
}

export const DeviceIllustration = styled.img.attrs(p => ({
  src: illustrations[p.deviceModel.id],
}))`
  max-height: 153px;
  margin-left: 36px;
  margin-right: 56px;
  filter: drop-shadow(0px 10px 10px rgba(0, 0, 0, 0.2));
`

const Separator = styled.div`
  height: 1px;
  margin: 20px 0px;
  background: ${p => p.theme.colors.palette.background.default};
  width: 100%;
`

const Info = styled.div`
  font-family: Inter;
  display: flex;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 16px;

  & > div {
    display: flex;
    flex-direction: row;
    & > :nth-child(2) {
      margin-left: 10px;
    }
    margin-right: 30px;
  }
`

const StorageBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: 3px;
  height: 23px;
  background: ${p => p.theme.colors.palette.text.shade10};
  overflow: hidden;
`

const StorageBarItem = styled.div.attrs(props => ({
  width: `${(props.ratio * 100).toFixed(3)}%`,
}))`
  display: flex;
  width: ${p => p.width};
  background-clip: content-box !important;
  & > * {
    width: 100%;
    height: 100%;
  }
  position: relative;
  &::after {
    content: ' ';
    width: 1px;
    height: 100%;
    position: absolute;
    right: 0;
    background: ${p => p.theme.colors.palette.text.shade10};
  }
`

const FreeInfo = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: ${p => (p.danger ? p.theme.colors.alertRed : p.theme.colors.palette.text.shade100)};
`

const GenuineCheckBadge = styled.div`
  color: ${p => p.theme.colors.palette.background.paper};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 2px;
  display: flex;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.colors.palette.primary.main};
`

const TooltipContentWrapper = styled.div`
  & > :nth-child(1) {
    color: ${p => rgba(p.theme.colors.palette.background.paper, 0.7)};
    text-align: center;
    display: block;
  }
  & > :nth-child(2) {
    color: ${p => p.theme.colors.palette.background.paper};
    text-align: center;
  }
`

const TooltipContent = ({ name, bytes }: { name: string, bytes: number }) => (
  <TooltipContentWrapper>
    <Text>{name}</Text>
    <Text>{formatSize(bytes)}</Text>
  </TooltipContentWrapper>
)

export const StorageBar = ({ distribution }: { distribution: * }) => (
  <StorageBarWrapper>
    {distribution.apps.map(({ name, currency, bytes, blocks }) => {
      const color = currency ? currency.color : 'black'
      return (
        <StorageBarItem
          key={name}
          style={{ background: color }}
          ratio={blocks / (distribution.totalBlocks - distribution.osBlocks)}
        >
          <Tooltip content={<TooltipContent name={name} bytes={bytes} />} />
        </StorageBarItem>
      )
    })}
  </StorageBarWrapper>
)

const DeviceStorage = ({ state, deviceInfo }: *) => {
  const distribution = distribute(state)

  return (
    <div>
      <Card p={20} horizontal>
        <DeviceIllustration deviceModel={state.deviceModel} />
        <div style={{ flex: 1 }}>
          <Box horizontal alignItems="center">
            <Text ff="Inter|Bold" color="palette.text.shade100" fontSize={5}>
              {state.deviceModel.productName}
            </Text>
            <Tooltip content={<Trans i18nKey="managerv2.deviceStorage.genuine" />}>
              <GenuineCheckBadge>
                <IconCheck size={12} />
              </GenuineCheckBadge>
            </Tooltip>
          </Box>
          <Box>
            <Text ff="Inter|Regular" color="palette.text.shade40" fontSize={4}>
              <Trans
                i18nKey="managerv2.deviceStorage.firmware"
                values={{ version: deviceInfo.version }}
              />
            </Text>
          </Box>
          <Separator />
          <Info>
            <div>
              <Text fontSize={3}>
                <Trans i18nKey="managerv2.deviceStorage.used" />
              </Text>
              <Text color="palette.text.shade40" ff="Inter|Bold" fontSize={3}>
                {formatSize(distribution.totalAppsBytes)}
              </Text>
            </div>
            <div>
              <Text fontSize={3}>
                <Trans i18nKey="managerv2.deviceStorage.capacity" />
              </Text>
              <Text color="palette.text.shade40" ff="Inter|Bold" fontSize={3}>
                {formatSize(distribution.appsSpaceBytes)}
              </Text>
            </div>
            <div>
              <Text fontSize={3}>
                <Trans i18nKey="managerv2.deviceStorage.installed" />
              </Text>
              <Text color="palette.text.shade40" ff="Inter|Bold" fontSize={3}>
                {distribution.apps.length}
              </Text>
            </div>
          </Info>
          <StorageBar distribution={distribution} />
          <FreeInfo danger={distribution.shouldWarnMemory}>
            {distribution.shouldWarnMemory ? <IconWarning /> : ''}{' '}
            <Text ff="Inter|SemiBold" fontSize={3}>
              <Trans
                i18nKey="managerv2.deviceStorage.freeSpace"
                values={{ space: formatSize(distribution.freeSpaceBytes) || '0' }}
              />
            </Text>
          </FreeInfo>
        </div>
      </Card>
    </div>
  )
}

export default DeviceStorage
