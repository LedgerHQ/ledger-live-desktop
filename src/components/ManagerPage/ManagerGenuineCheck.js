// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { i } from 'helpers/staticPath'

import GenuineCheck from 'components/GenuineCheck'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import Text from 'components/base/Text'
import TrackPage from 'analytics/TrackPage'

type Props = {
  t: T,
  onSuccess: void => void,
}

class ManagerGenuineCheck extends PureComponent<Props> {
  render() {
    const { t, onSuccess } = this.props
    return (
      <Box align="center" py={7} selectable>
        <TrackPage category="Manager" name="Genuine Check" />
        <Box align="center" style={{ maxWidth: 460 }}>
          <img
            src={i('logos/connectDevice.png')}
            alt="connect your device"
            style={{ marginBottom: 30, maxWidth: 25, width: '100%' }}
          />
          <Text ff="Museo Sans|Regular" fontSize={7} color="dark" style={{ marginBottom: 10 }}>
            {t('manager.device.title')}
          </Text>
          <Text ff="Museo Sans|Light" fontSize={5} color="grey" align="center">
            {t('manager.device.desc')}
          </Text>
        </Box>
        <Space of={40} />
        <GenuineCheck onSuccess={onSuccess} style={{ width: 400 }} />
      </Box>
    )
  }
}

export default translate()(ManagerGenuineCheck)
