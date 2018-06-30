// @flow
import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setShareAnalytics } from 'actions/settings'
import { shareAnalyticsSelector } from 'reducers/settings'
import Track from 'analytics/Track'
import CheckBox from 'components/base/CheckBox'

const mapStateToProps = createStructuredSelector({
  shareAnalytics: shareAnalyticsSelector,
})

const mapDispatchToProps = {
  setShareAnalytics,
}

type Props = {
  shareAnalytics: boolean,
  setShareAnalytics: boolean => void,
}

class ShareAnalytics extends PureComponent<Props> {
  render() {
    const { shareAnalytics, setShareAnalytics } = this.props
    return (
      <Fragment>
        <Track onUpdate event={shareAnalytics ? 'AnalyticsEnabled' : 'AnalyticsDisabled'} />
        <CheckBox isChecked={shareAnalytics} onChange={setShareAnalytics} />
      </Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShareAnalytics)
