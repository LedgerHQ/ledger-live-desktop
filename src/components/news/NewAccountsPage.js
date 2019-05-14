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

type State = {
  reverse: boolean,
  show: boolean,
}

class UpdateNoticeB extends PureComponent<Props, State> {
  state = {
    reverse: false,
    // we will only starts showing if it was not dismissed yet
    // however, we shouldn't hide it on "side effect" dismiss (aka opening account)
    // but only if explicitely closing the modal
    show: this.props.showAccountsHelperBanner,
  }

  dismissUpdateBanner = async () => {
    this.setState({ reverse: true })
    await delay(500)
    this.props.dismissBanner(accountsBannerKey)
    this.setState({ show: false })
  }

  render() {
    const { reverse, show } = this.state
    if (!show) return null
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
