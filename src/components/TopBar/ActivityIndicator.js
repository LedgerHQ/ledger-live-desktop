// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { translate } from 'react-i18next'

import type { T } from 'types/common'
import type { AsyncState } from 'reducers/bridgeSync'

import { globalSyncStateSelector } from 'reducers/bridgeSync'
import { hasAccountsSelector } from 'reducers/accounts'
import { BridgeSyncConsumer } from 'bridge/BridgeSyncContext'
import CounterValues from 'helpers/countervalues'

import { Rotating } from 'components/base/Spinner'
import Box from 'components/base/Box'
import IconRefresh from 'icons/Refresh'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconCheckCircle from 'icons/CheckCircle'
import ItemContainer from './ItemContainer'

const mapStateToProps = createStructuredSelector({
  globalSyncState: globalSyncStateSelector,
  hasAccounts: hasAccountsSelector,
})

type Props = {
  // FIXME: eslint should see that it is used in static method
  isGlobalSyncStatePending: boolean, // eslint-disable-line react/no-unused-prop-types

  isPending: boolean,
  isError: boolean,
  t: T,
  cvPoll: *,
  setSyncBehavior: *,
}

type State = {
  hasClicked: boolean,
  isGlobalSyncStatePending: boolean,
  isFirstSync: boolean,
}

class ActivityIndicatorInner extends PureComponent<Props, State> {
  state = {
    hasClicked: false,
    isFirstSync: true,

    // FIXME: eslint should see that it is used in static method
    isGlobalSyncStatePending: false, // eslint-disable-line react/no-unused-state
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const nextState = {
      ...prevState,
      isGlobalSyncStatePending: nextProps.isGlobalSyncStatePending,
    }

    if (prevState.isGlobalSyncStatePending && !nextProps.isGlobalSyncStatePending) {
      nextState.isFirstSync = false
      nextState.hasClicked = false
    }

    return nextState
  }

  onClick = () => {
    this.props.cvPoll()
    this.props.setSyncBehavior({ type: 'SYNC_ALL_ACCOUNTS', priority: 5 })
  }

  handleRefresh = () => {
    this.setState({ hasClicked: true })
    this.onClick()
  }

  render() {
    const { isPending, isError, t } = this.props
    const { hasClicked, isFirstSync } = this.state
    const isDisabled = isError || (isPending && (isFirstSync || hasClicked))
    const isRotating = isPending && (hasClicked || isFirstSync)

    return (
      <ItemContainer disabled={isDisabled} onClick={isDisabled ? undefined : this.handleRefresh}>
        <Rotating
          size={16}
          isRotating={isRotating}
          color={isError ? 'alertRed' : isRotating ? undefined : 'positiveGreen'}
        >
          {isError ? (
            <IconExclamationCircle size={16} />
          ) : isRotating ? (
            <IconRefresh size={16} />
          ) : (
            <IconCheckCircle size={16} />
          )}
        </Rotating>
        <Box
          ml={1}
          ff="Open Sans|SemiBold"
          color={isError ? 'alertRed' : undefined}
          fontSize={4}
          horizontal
          align="center"
        >
          {isRotating ? (
            t('app:common.sync.syncing')
          ) : isError ? (
            <Fragment>
              <Box>{t('app:common.sync.error')}</Box>
              <Box
                ml={2}
                cursor="pointer"
                style={{ textDecoration: 'underline', pointerEvents: 'all' }}
                onClick={this.handleRefresh}
              >
                {t('app:common.sync.refresh')}
              </Box>
            </Fragment>
          ) : (
            t('app:common.sync.upToDate')
          )}
        </Box>
      </ItemContainer>
    )
  }
}

const ActivityIndicator = ({
  globalSyncState,
  hasAccounts,
  t,
}: {
  globalSyncState: AsyncState,
  hasAccounts: boolean,
  t: T,
}) =>
  !hasAccounts ? null : (
    <BridgeSyncConsumer>
      {setSyncBehavior => (
        <CounterValues.PollingConsumer>
          {cvPolling => {
            const isPending = cvPolling.pending || globalSyncState.pending
            const isError = cvPolling.error || globalSyncState.error
            return (
              <ActivityIndicatorInner
                t={t}
                isPending={isPending}
                isGlobalSyncStatePending={globalSyncState.pending}
                isError={!!isError && !isPending}
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
