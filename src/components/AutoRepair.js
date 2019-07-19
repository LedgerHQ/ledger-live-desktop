// @flow

import React, { useState, useEffect } from 'react'
import noop from 'lodash/noop'
import { Trans } from 'react-i18next'
import logger from 'logger'
import RepairModal from 'components/base/Modal/RepairModal'
import firmwareRepair from 'commands/firmwareRepair'

type Props = {
  onDone: () => void,
}

const AutoRepair = ({ onDone }: Props) => {
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const sub = firmwareRepair.send({ version: null }).subscribe({
      next: patch => {
        if ('progress' in patch) {
          setProgress(patch.progress)
        }
      },
      error: error => {
        logger.critical(error)
        setError(error)
      },
      complete: () => onDone(),
    })
    return () => sub.unsubscribe()
  }, [onDone])

  return (
    <RepairModal
      isAlreadyBootloader
      cancellable
      analyticsName="RepairDevice"
      isOpened
      isLoading
      onClose={onDone}
      onReject={onDone}
      repair={noop}
      title={<Trans i18nKey="settings.repairDevice.title" />}
      desc={<Trans i18nKey="settings.repairDevice.desc" />}
      progress={progress}
      error={error}
    />
  )
}

export default AutoRepair
