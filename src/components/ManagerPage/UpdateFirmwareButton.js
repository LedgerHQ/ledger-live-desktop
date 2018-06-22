// @flow
import React, { Fragment } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { EXPERIMENTAL_FIRMWARE_UPDATE } from 'config/constants'

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
  installFirmware: () => void,
}

const UpdateFirmwareButton = ({ t, firmware, installFirmware }: Props) =>
  firmware ? (
    <Fragment>
      <Text ff="Open Sans|Regular" fontSize={4} style={{ marginLeft: 'auto', marginRight: 15 }}>
        {t('app:manager.firmware.latest', { version: getCleanVersion(firmware.name) })}
      </Text>
      <Button primary onClick={installFirmware} disabled={!EXPERIMENTAL_FIRMWARE_UPDATE}>
        {t('app:manager.firmware.update')}
      </Button>
    </Fragment>
  ) : null

export default translate()(UpdateFirmwareButton)
