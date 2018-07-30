// @flow
import React, { Fragment } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Button from 'components/base/Button'
import Text from 'components/base/Text'
import { getCleanVersion } from 'components/ManagerPage/FirmwareUpdate'

type FirmwareInfos = {
  name: string,
  notes: string,
}

type Props = {
  t: T,
  firmware: ?FirmwareInfos,
  onClick: () => void,
}

const UpdateFirmwareButton = ({ t, firmware, onClick }: Props) =>
  firmware ? (
    <Fragment>
      <Text ff="Open Sans|Regular" fontSize={4} style={{ marginLeft: 'auto', marginRight: 15 }}>
        {t('app:manager.firmware.latest', { version: getCleanVersion(firmware.name) })}
      </Text>
      <Button
        primary
        onClick={onClick}
        event={'Manager Firmware Update Click'}
        eventProperties={{
          firmwareName: firmware.name,
        }}
      >
        {t('app:manager.firmware.update')}
      </Button>
    </Fragment>
  ) : null

export default translate()(UpdateFirmwareButton)
