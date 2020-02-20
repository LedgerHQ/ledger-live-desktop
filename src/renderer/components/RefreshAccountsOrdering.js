// @flow

import { Component } from "react";
import { connect } from "react-redux";
import { refreshAccountsOrdering } from "~/renderer/actions/general";

const mapStateToProps = null;

const mapDispatchToProps = {
  refreshAccountsOrdering,
};

class RefreshAccountsOrdering extends Component<{
  refreshAccountsOrdering: () => *,
  onMount?: boolean,
  onUnmount?: boolean,
}> {
  componentDidMount() {
    if (this.props.onMount) {
      this.props.refreshAccountsOrdering();
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.refreshAccountsOrdering();
    }
  }

  render() {
    return null;
  }
}

const m: React$ComponentType<{}> = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RefreshAccountsOrdering);

export default m;
