// @flow

import { createStructuredSelector } from 'reselect'
import { Trans } from 'react-i18next'
import React, { PureComponent, useCallback, useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { colors } from 'styles/theme'
import IconCheck from 'icons/Check'
import IconLoader from 'icons/Loader'
import IconPending from 'icons/Clock'
import IconError from 'icons/Error'
import Box from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'
import TranslatedError from 'components/TranslatedError'
import { useBridgeSync } from '../../bridge/BridgeSyncContext'
import { isUpToDateAccountSelector } from '../../reducers/accounts'
import { accountSyncStateSelector } from '../../reducers/bridgeSync'
import { Rotating } from '../base/Spinner'

const mapStateToProps = createStructuredSelector({
  syncState: accountSyncStateSelector,
  isUpToDateAccount: isUpToDateAccountSelector,
})

class StatusQueued extends PureComponent<{ onClick: (*) => void }> {
  render() {
    const { onClick } = this.props
    return (
      <Tooltip render={() => <Trans i18nKey="common.sync.outdated" />}>
        <Box onClick={onClick}>
          <IconPending color={colors.grey} size={16} />
        </Box>
      </Tooltip>
    )
  }
}

class StatusSynchronizing extends PureComponent<{ onClick: (*) => void }> {
  render() {
    const { onClick } = this.props
    return (
      <Tooltip render={() => <Trans i18nKey="common.sync.syncing" />}>
        <Box onClick={onClick}>
          <Rotating onClick={onClick} size={16}>
            <IconLoader color={colors.grey} size={16} />
          </Rotating>
        </Box>
      </Tooltip>
    )
  }
}

class StatusUpToDate extends PureComponent<{ onClick: (*) => void }> {
  render() {
    const { onClick } = this.props
    return (
      <Tooltip render={() => <Trans i18nKey="common.sync.upToDate" />}>
        <Box onClick={onClick}>
          <IconCheck onClick={onClick} color={colors.positiveGreen} size={16} />
        </Box>
      </Tooltip>
    )
  }
}

class StatusError extends PureComponent<{ onClick: (*) => void, error: ?Error }> {
  render() {
    const { onClick, error } = this.props
    return (
      <Tooltip
        tooltipBg="alertRed"
        render={() => (
          <Box style={{ maxWidth: 250 }}>
            <TranslatedError error={error} />
          </Box>
        )}
      >
        <Box onClick={onClick}>
          <IconError onClick={onClick} color={colors.alertRed} size={16} />
        </Box>
      </Tooltip>
    )
  }
}

const AccountSyncStatusIndicator = ({
  accountId,
  isUpToDateAccount,
  syncState: { pending, error },
}: *) => {
  const setSyncBehavior = useBridgeSync()
  const [userAction, setUserAction] = useState(false)
  const timeout = useRef(null)
  const onClick = useCallback(
    e => {
      e.stopPropagation()
      setSyncBehavior({
        type: 'SYNC_ONE_ACCOUNT',
        accountId,
        priority: 10,
      })
      setUserAction(true)
      // a user action is kept in memory for a short time (which will correspond to a spinner time)
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setUserAction(false), 1000)
    },
    [setSyncBehavior, accountId],
  )

  // at unmount, clear all timeouts
  useEffect(() => {
    clearTimeout(timeout.current)
  }, [])

  // We optimistically will show things are up to date even if it's actually synchronizing
  // in order to "debounce" the UI and don't make it blinks each time a sync happens
  // only when user did the account we will show the true state
  if ((pending && !isUpToDateAccount) || userAction) {
    return <StatusSynchronizing onClick={onClick} />
  }
  if (error) {
    return <StatusError onClick={onClick} error={error} />
  }
  if (isUpToDateAccount) {
    return <StatusUpToDate onClick={onClick} />
  }
  return <StatusQueued onClick={onClick} />
}

export default connect(mapStateToProps)(AccountSyncStatusIndicator)
