// @flow

import { PureComponent } from 'react'

type Props = {
  render: ({ isVerified?: ?boolean }) => *,
}

type State = {
  isVerified: null | boolean,
}

class CheckAddress extends PureComponent<Props, State> {
  state = {
    isVerified: null,
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  _isUnmounted = false

  safeSetState = (...args: *) => {
    if (this._isUnmounted) {
      return
    }
    this.setState(...args)
  }

  render() {
    const { render } = this.props
    const { isVerified } = this.state

    return render({ isVerified })
  }
}

export default CheckAddress
