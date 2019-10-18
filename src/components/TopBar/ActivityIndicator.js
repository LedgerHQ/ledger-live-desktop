// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { translate } from 'react-i18next'

import type { T } from 'types/common'
import type { AsyncState } from 'reducers/bridgeSync'

import { track } from 'analytics/segment'
import { globalSyncStateSelector } from 'reducers/bridgeSync'
import { isUpToDateSelector } from 'reducers/accounts'
import { BridgeSyncConsumer } from 'bridge/BridgeSyncContext'
import CounterValues from 'helpers/countervalues'

import { Rotating } from 'components/base/Spinner'
import Tooltip from 'components/base/Tooltip'
import TranslatedError from 'components/TranslatedError'
import Box from 'components/base/Box'
import IconLoader from 'icons/Loader'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconCheckCircle from 'icons/CheckCircle'
import ItemContainer from './ItemContainer'

const mapStateToProps = createStructuredSelector({
  globalSyncState: globalSyncStateSelector,
  isUpToDate: isUpToDateSelector,
})

type Props = {
  error: ?Error,
  isPending: boolean,
  isError: boolean,
  isUpToDate: boolean,
  t: T,
  cvPoll: *,
  setSyncBehavior: *,
}

class ActivityIndicatorInner extends PureComponent<Props, { lastClickTime: number }> {
  state = {
    lastClickTime: 0,
  }

  onClick = () => {
    this.props.cvPoll()
    this.props.setSyncBehavior({ type: 'SYNC_ALL_ACCOUNTS', priority: 5 })
    this.setState({ lastClickTime: Date.now() })
    track('SyncRefreshClick')
  }

  render() {
    const { isUpToDate, isPending, isError, error, t } = this.props
    const { lastClickTime } = this.state
    const isUserClick = Date.now() - lastClickTime < 1000
    const isRotating = isPending && (!isUpToDate || isUserClick)
    const isDisabled = isError || isRotating

    const content = (
      <ItemContainer disabled={isDisabled} onClick={isDisabled ? undefined : this.onClick}>
        <Rotating
          size={16}
          isRotating={isRotating}
          color={
            isError
              ? 'alertRed'
              : isRotating
              ? 'palette.text.shade60'
              : isUpToDate
              ? 'positiveGreen'
              : 'palette.text.shade60'
          }
        >
          {isError ? (
            <IconExclamationCircle size={16} />
          ) : isRotating ? (
            <IconLoader size={16} />
          ) : isUpToDate ? (
            <IconCheckCircle size={16} />
          ) : (
            <IconExclamationCircle size={16} />
          )}
        </Rotating>
        <Box
          data-e2e="syncButton"
          ml={isRotating ? 2 : 1}
          ff="Inter|SemiBold"
          color={isError ? 'alertRed' : undefined}
          fontSize={4}
          horizontal
          align="center"
        >
          {isRotating ? (
            t('common.sync.syncing')
          ) : isError ? (
            <Fragment>
              <Box>{t('common.sync.error')}</Box>
              <Box
                ml={2}
                style={{ textDecoration: 'underline', pointerEvents: 'all' }}
                onClick={this.onClick}
              >
                {t('common.sync.refresh')}
              </Box>
            </Fragment>
          ) : isUpToDate ? (
            t('common.sync.upToDate')
          ) : (
            t('common.sync.outdated')
          )}
        </Box>
      </ItemContainer>
    )

    if (isError && error) {
      return (
        <Tooltip
          tooltipBg="alertRed"
          content={
            <Box fontSize={4} p={2} style={{ maxWidth: 250 }}>
              <TranslatedError error={error} />
            </Box>
          }
        >
          {content}
        </Tooltip>
      )
    }

    return content
  }
}

const ActivityIndicator = ({
  globalSyncState,
  t,
  isUpToDate,
}: {
  globalSyncState: AsyncState,
  t: T,
  isUpToDate: boolean,
}) => (
  <BridgeSyncConsumer>
    {setSyncBehavior => (
      <CounterValues.PollingConsumer>
        {cvPolling => {
          const isPending = cvPolling.pending || globalSyncState.pending
          const isError = !isPending && (cvPolling.error || globalSyncState.error)
          return (
            <ActivityIndicatorInner
              t={t}
              isUpToDate={isUpToDate}
              isPending={isPending}
              isError={!!isError && !isUpToDate} // we only show error if it's not up to date. this hide a bit error that happen from time to time
              error={isError ? globalSyncState.error : null}
              cvPoll={cvPolling.poll}
              setSyncBehavior={setSyncBehavior}
            />
          )
        }}
      </CounterValues.PollingConsumer>
    )}
  </BridgeSyncConsumer>
)

export default compose(
  translate(),
  connect(mapStateToProps),
)(ActivityIndicator)
