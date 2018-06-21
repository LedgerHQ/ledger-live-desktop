// @flow

import React, { PureComponent, Fragment } from 'react'
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
import Tooltip from 'components/base/Tooltip'
import TranslatedError from 'components/TranslatedError'
import Box from 'components/base/Box'
import IconLoader from 'icons/Loader'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconCheckCircle from 'icons/CheckCircle'
import ItemContainer from './ItemContainer'

const mapStateToProps = createStructuredSelector({
  globalSyncState: globalSyncStateSelector,
})

type Props = {
  // FIXME: eslint should see that it is used in static method
  isGlobalSyncStatePending: boolean, // eslint-disable-line react/no-unused-prop-types

  error: ?Error,
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
    const { isPending, isError, error, t } = this.props
    const { hasClicked, isFirstSync } = this.state
    const isDisabled = isError || (isPending && (isFirstSync || hasClicked))
    const isRotating = isPending && (hasClicked || isFirstSync)

    const content = (
      <ItemContainer disabled={isDisabled} onClick={isDisabled ? undefined : this.handleRefresh}>
        <Rotating
          size={16}
          isRotating={isRotating}
          color={isError ? 'alertRed' : isRotating ? 'grey' : 'positiveGreen'}
        >
          {isError ? (
            <IconExclamationCircle size={16} />
          ) : isRotating ? (
            <IconLoader size={16} />
          ) : (
            <IconCheckCircle size={16} />
          )}
        </Rotating>
        <Box
          ml={isRotating ? 2 : 1}
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

    if (error) {
      return (
        <Tooltip
          tooltipBg="alertRed"
          render={() => (
            <Box fontSize={4} p={2} style={{ maxWidth: 250 }}>
              <TranslatedError error={error} />
            </Box>
          )}
        >
          {content}
        </Tooltip>
      )
    }

    return content
  }
}

const ActivityIndicator = ({ globalSyncState, t }: { globalSyncState: AsyncState, t: T }) => (
  <BridgeSyncConsumer>
    {setSyncBehavior => (
      <CounterValues.PollingConsumer>
        {cvPolling => {
          const isPending = cvPolling.pending || globalSyncState.pending
          const isError = !isPending && (cvPolling.error || globalSyncState.error)
          return (
            <ActivityIndicatorInner
              t={t}
              isPending={isPending}
              isGlobalSyncStatePending={globalSyncState.pending}
              isError={!!isError}
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
