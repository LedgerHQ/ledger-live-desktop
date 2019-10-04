// @flow

import React, { useState, useEffect } from 'react'
import { Trans } from 'react-i18next'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import ConnectTroubleshootingHelpButton from 'components/ConnectTroubleshootingHelpButton'
import RepairDeviceButton from 'components/SettingsPage/RepairDeviceButton'

type Props = {
  appearsAfterDelay?: number,
  onRepair?: boolean => void,
}

const ConnectTroubleshooting = ({ appearsAfterDelay = 20000, onRepair }: Props) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), appearsAfterDelay)
    return () => clearTimeout(timeout)
  }, [appearsAfterDelay])

  return visible ? (
    <Box p={4} alignItems="center">
      <Box p={2}>
        <Text ff="Inter|SemiBold" fontSize={4}>
          <Trans i18nKey="connectTroubleshooting.desc" />
        </Text>
      </Box>
      <Box horizontal>
        <ConnectTroubleshootingHelpButton />
        <RepairDeviceButton onRepair={onRepair} />
      </Box>
    </Box>
  ) : null
}

export default ConnectTroubleshooting
