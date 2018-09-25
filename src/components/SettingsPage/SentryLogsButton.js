// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setSentryLogs } from 'actions/settings'
import { sentryLogsSelector } from 'reducers/settings'
import Track from 'analytics/Track'
import Switch from 'components/base/Switch'

const mapStateToProps = createStructuredSelector({
  sentryLogs: sentryLogsSelector,
})

const mapDispatchToProps = {
  setSentryLogs,
}

type Props = {
  sentryLogs: boolean,
  setSentryLogs: boolean => void,
}

class SentryLogsButton extends PureComponent<Props> {
  render() {
    const { sentryLogs, setSentryLogs } = this.props
    return (
      <Fragment>
        <Track onUpdate event={sentryLogs ? 'SentryEnabled' : 'SentryDisabled'} />
        <Switch isChecked={sentryLogs} onChange={setSentryLogs} data-e2e="reportBugs_button" />
      </Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SentryLogsButton)
