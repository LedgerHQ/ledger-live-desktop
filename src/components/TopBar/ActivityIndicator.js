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

const DISPLAY_SUCCESS_TIME = 2 * 1000

const mapStateToProps = createStructuredSelector({ globalSyncState: globalSyncStateSelector })

type Props = { isPending: boolean, isError: boolean, onClick: void => void, t: T }
type State = { hasClicked: boolean, displaySuccess: boolean }

class ActivityIndicatorInner extends Component<Props, State> {
  state = {
    hasClicked: false,
    displaySuccess: false,
  }

  _timeout = null

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (prevState.hasClicked && !nextProps.isPending) {
      return { hasClicked: false, displaySuccess: !nextProps.isError }
    }

    return null
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.displaySuccess && this.state.displaySuccess) {
      if (this._timeout) {
        clearTimeout(this._timeout)
      }
      this._timeout = setTimeout(
        () => this.setState({ displaySuccess: false }),
        DISPLAY_SUCCESS_TIME,
      )
    }
  }

  handleRefresh = () => {
    const { onClick } = this.props
    this.setState({ hasClicked: true })
    onClick()
  }

  render() {
    const { isPending, isError, t } = this.props
    const { hasClicked, displaySuccess } = this.state
    const isDisabled = hasClicked || displaySuccess || isError
    return (
      <ItemContainer isDisabled={isDisabled} onClick={isDisabled ? undefined : this.handleRefresh}>
        <Rotating
          size={16}
          isRotating={isPending && hasClicked}
          color={isError ? 'alertRed' : displaySuccess ? 'positiveGreen' : undefined}
        >
          {isError ? (
            <IconExclamationCircle size={16} />
          ) : displaySuccess ? (
            <IconCheckCircle size={16} />
          ) : (
            <IconRefresh size={16} />
          )}
        </Rotating>
        {(displaySuccess || isError || (isPending && hasClicked)) && (
          <Box
            ml={2}
            ff="Open Sans|SemiBold"
            color={isError ? 'alertRed' : undefined}
            fontSize={4}
            horizontal
            align="center"
          >
            {displaySuccess ? (
              t('common:sync.upToDate')
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
              t('common:sync.syncing')
            )}
          </Box>
        )}
      </ItemContainer>
    )
  }
}

const ActivityIndicator = ({ globalSyncState, t }: { globalSyncState: AsyncState, t: T }) => (
  <BridgeSyncConsumer>
    {bridgeSync => (
      <CounterValues.PollingConsumer>
        {cvPolling => {
          const isPending = cvPolling.pending || globalSyncState.pending
          const isError = cvPolling.error || globalSyncState.error
          return (
            <ActivityIndicatorInner
              t={t}
              isPending={isPending}
              isError={!!isError && !isPending}
              onClick={() => {
                cvPolling.poll()
                bridgeSync.syncAll()
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
