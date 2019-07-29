// @flow
import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setHideEmptyTokenAccounts } from 'actions/settings'
import { hideEmptyTokenAccountsSelector } from 'reducers/settings'
import Track from 'analytics/Track'
import Switch from 'components/base/Switch'

const mapStateToProps = createStructuredSelector({
  hideEmptyTokenAccounts: hideEmptyTokenAccountsSelector,
})

const mapDispatchToProps = {
  setHideEmptyTokenAccounts,
}

type Props = {
  hideEmptyTokenAccounts: boolean,
  setHideEmptyTokenAccounts: boolean => void,
}

class HideEmptyTokenAccountsToggle extends PureComponent<Props> {
  render() {
    const { hideEmptyTokenAccounts, setHideEmptyTokenAccounts } = this.props
    return (
      <Fragment>
        <Track
          onUpdate
          event={
            hideEmptyTokenAccounts
              ? 'hideEmptyTokenAccountsEnabled'
              : 'hideEmptyTokenAccountsDisabled'
          }
        />
        <Switch
          isChecked={hideEmptyTokenAccounts}
          onChange={setHideEmptyTokenAccounts}
          data-e2e="hideEmptyTokenAccounts_button"
        />
      </Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HideEmptyTokenAccountsToggle)
