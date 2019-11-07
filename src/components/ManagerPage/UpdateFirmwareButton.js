// @flow
import React, { Fragment } from 'react'
import { translate } from 'react-i18next'

import semver from 'semver'
import type { T } from 'types/common'
import type {
  OsuFirmware,
  FinalFirmware,
  DeviceInfo,
} from '@ledgerhq/live-common/lib/types/manager'
import Button from 'components/base/Button'
import Text from 'components/base/Text'
import { getCleanVersion } from 'components/ManagerPage/FirmwareUpdate'
import IconInfoCircle from 'icons/InfoCircle'
import Box from '../base/Box'

type Props = {
  t: T,
  firmware: ?{ osu: OsuFirmware, final: FinalFirmware },
  onClick: () => void,
  deviceInfo: DeviceInfo,
}

const UpdateFirmwareButton = ({ t, firmware, onClick, deviceInfo }: Props) =>
  firmware ? (
    <Fragment>
      <Box vertical align="center" style={{ marginLeft: 'auto', marginRight: 15 }}>
        <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade100">
          {t('manager.firmware.latest', { version: getCleanVersion(firmware.final.name) })}
        </Text>
        {semver.lte(deviceInfo.version, '1.4.2') && (
          <Box horizontal alignItems="center">
            <IconInfoCircle size={12} style={{ marginRight: 6 }} />
            <Text ff="Inter" fontSize={3} color="palette.text.shade60">
              {t('manager.firmware.removeApps')}
            </Text>
          </Box>
        )}
      </Box>

      <Button
        primary
        onClick={onClick}
        event={'Manager Firmware Update Click'}
        eventProperties={{
          firmwareName: firmware.final.name,
        }}
      >
        {t('manager.firmware.updateBtn')}
      </Button>
    </Fragment>
  ) : null

export default translate()(UpdateFirmwareButton)
