// @flow

import React, { Component, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { translate } from 'react-i18next'

import type { T } from 'types/common'
import type { AsyncState } from 'reducers/bridgeSync'

import { globalSyncStateSelector } from 'reducers/bridgeSync'
import { BridgeSyncConsumer } from 'bridge/BridgeSyncContext'
import CounterValues from 'helpers/countervalues'

import { Rotating } from 'components/base/Spinner'
import Box from 'components/base/Box'
import IconRefresh from 'icons/Refresh'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconCheckCircle from 'icons/CheckCircle'
import ItemContainer from './ItemContainer'

const mapStateToProps = createStructuredSelector({ globalSyncState: globalSyncStateSelector })

type Props = {
  // FIXME: eslint should see that it is used in static method
  isGlobalSyncStatePending: boolean, // eslint-disable-line react/no-unused-prop-types

  isPending: boolean,
  isError: boolean,
  onClick: void => void,
  t: T,
}

type State = {
  hasClicked: boolean,
  isGlobalSyncStatePending: boolean,
  isFirstSync: boolean,
}

class ActivityIndicatorInner extends Component<Props, State> {
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

    if (prevState.hasClicked && !nextProps.isGlobalSyncStatePending) {
      nextState.hasClicked = false
    }

    if (prevState.isGlobalSyncStatePending && !nextProps.isGlobalSyncStatePending) {
      nextState.isFirstSync = false
    }

    return nextState
  }

  handleRefresh = () => {
    const { onClick } = this.props
    this.setState({ hasClicked: true })
    onClick()
  }

  render() {
    const { isPending, isError, t } = this.props
    const { hasClicked, isFirstSync } = this.state
    const isDisabled = hasClicked || isError
    const isRotating = isPending && (hasClicked || isFirstSync)

    return (
      <ItemContainer isDisabled={isDisabled} onClick={isDisabled ? undefined : this.handleRefresh}>
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
          ml={2}
          ff="Open Sans|SemiBold"
          color={isError ? 'alertRed' : undefined}
          fontSize={4}
          horizontal
          align="center"
        >
          {isRotating ? (
            t('common:sync.syncing')
          ) : isError ? (
            <Fragment>
              <Box>{t('common:sync.error')}</Box>
              <Box
                ml={2}
                cursor="pointer"
                style={{ textDecoration: 'underline', pointerEvents: 'all' }}
                onClick={this.handleRefresh}
              >
                {t('common:sync.refresh')}
              </Box>
            </Fragment>
          ) : (
            t('common:sync.upToDate')
          )}
        </Box>
      </ItemContainer>
    )
  }
}

const ActivityIndicator = ({ globalSyncState, t }: { globalSyncState: AsyncState, t: T }) => (
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
              onClick={() => {
                cvPolling.poll()
                setSyncBehavior({ type: 'SYNC_ALL_ACCOUNTS', priority: 5 })
              }}
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
