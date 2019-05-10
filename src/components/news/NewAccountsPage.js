// All components and utility related to the "new accounts" page

// @flow
/* eslint-disable react/no-unused-prop-types */

import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { dismissedBannerSelector } from 'reducers/settings'
import { dismissBanner } from 'actions/settings'
import { Trans } from 'react-i18next'
import { delay } from 'helpers/promise'
import { Dot } from '../Updater/UpdateDot'
import NewUpdateNotice from '../NewUpdateNotice'

const accountsBannerKey = 'accountsHelperBanner'

const mapStateToProps = state => ({
  showAccountsHelperBanner: !dismissedBannerSelector(state, { bannerKey: accountsBannerKey }),
})
const mapDispatch = { dismissBanner }

type Props = {
  showAccountsHelperBanner: boolean,
  dismissBanner: string => void,
}

class NotifDotB extends PureComponent<Props> {
  render() {
    if (!this.props.showAccountsHelperBanner) return null
    return <Dot />
  }
}
export const NotifDot = connect(
  mapStateToProps,
  mapDispatch,
)(NotifDotB)

export class DismissB extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.showAccountsHelperBanner) this.props.dismissBanner(accountsBannerKey)
  }
  render() {
    return null
  }
}

export const Dismiss = connect(
  mapStateToProps,
  mapDispatch,
)(DismissB)

class UpdateNoticeB extends PureComponent<Props, { reverse: boolean }> {
  state = {
    reverse: false,
  }

  dismissUpdateBanner = async () => {
    this.setState({ reverse: true })
    await delay(500)
    this.props.dismissBanner(accountsBannerKey)
  }

  render() {
    const { reverse } = this.state
    if (!this.props.showAccountsHelperBanner) return null
    return (
      <NewUpdateNotice
        reverse={reverse}
        callback={this.dismissUpdateBanner}
        title={
          <Fragment>
            <Trans i18nKey="sidebar.newUpdate.title" />
            {'  🎉'}
          </Fragment>
        }
        description={<Trans i18nKey="sidebar.newUpdate.description" />}
      />
    )
  }
}

export const UpdateNotice = connect(
  mapStateToProps,
  mapDispatch,
)(UpdateNoticeB)
