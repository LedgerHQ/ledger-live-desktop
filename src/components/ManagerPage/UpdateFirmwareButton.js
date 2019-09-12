// @flow
import React, { Fragment } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'
import type { OsuFirmware, FinalFirmware } from '@ledgerhq/live-common/lib/types/manager'
import Button from 'components/base/Button'
import Text from 'components/base/Text'
import { getCleanVersion } from 'components/ManagerPage/FirmwareUpdate'

type Props = {
  t: T,
  firmware: ?{ osu: OsuFirmware, final: FinalFirmware },
  onClick: () => void,
}

const UpdateFirmwareButton = ({ t, firmware, onClick }: Props) =>
  firmware ? (
    <Fragment>
      <Text ff="Open Sans|Regular" fontSize={4} style={{ marginLeft: 'auto', marginRight: 15 }}>
        {t('manager.firmware.latest', { version: getCleanVersion(firmware.final.name) })}
      </Text>
      <Button
        primary
        onClick={onClick}
        event={'Manager Firmware Update Click'}
        eventProperties={{
          firmwareName: firmware.final.name,
        }}
      >
        {t('manager.firmware.update')}
      </Button>
    </Fragment>
  ) : null

export default translate()(UpdateFirmwareButton)
