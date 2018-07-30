// @flow

import { Component } from 'react'
import { connect } from 'react-redux'
import { refreshAccountsOrdering } from 'actions/general'

const mapStateToProps = null

const mapDispatchToProps = {
  refreshAccountsOrdering,
}

class RefreshAccountsOrdering extends Component<{
  refreshAccountsOrdering: () => *,
  onMount?: boolean,
  onUnmount?: boolean,
}> {
  componentDidMount() {
    if (this.props.onMount) {
      this.props.refreshAccountsOrdering()
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.refreshAccountsOrdering()
    }
  }

  render() {
    return null
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RefreshAccountsOrdering)
