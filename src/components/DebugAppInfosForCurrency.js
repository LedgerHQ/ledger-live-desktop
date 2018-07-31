// @flow
import { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getCurrentDevice } from 'reducers/devices'
import debugAppInfosForCurrency from 'commands/debugAppInfosForCurrency'

class DebugAppInfosForCurrency extends Component<
  {
    children?: (?string) => React$Node,
    currencyId: string,
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
    const { device, currencyId } = this.props
    if (device) {
      debugAppInfosForCurrency
        .send({ currencyId, devicePath: device.path })
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
