// @flow
import { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getCurrentDevice } from 'reducers/devices'
import getAppAndVersion from 'commands/getAppAndVersion'

class DebugAppInfosForCurrency extends Component<
  {
    children?: (?string) => React$Node,
    device: *,
  },
  {
    version: ?string,
  },
> {
  state = {
    version: null,
  }
  componentDidMount() {
    const { device } = this.props
    if (device) {
      getAppAndVersion
        .send({ devicePath: device.path })
        .toPromise()
        .then(
          ({ version }) => {
            if (this.unmounted) return
            this.setState({ version })
          },
          () => {},
        )
    }
  }
  componentWillUnmount() {
    this.unmounted = true
  }
  unmounted = false
  render() {
    const { children } = this.props
    const { version } = this.state
    return children ? children(version) : null
  }
}

export default connect(
  createStructuredSelector({
    device: getCurrentDevice,
  }),
)(DebugAppInfosForCurrency)
