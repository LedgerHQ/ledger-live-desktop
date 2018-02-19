// @flow

import { PureComponent } from 'react'

type Props = {
  children: any,
}

type State = {
  shouldRender: boolean,
}

class Defer extends PureComponent<Props, State> {
  state = {
    shouldRender: false,
  }

  componentDidMount() {
    this._mounted = true

    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => this._mounted && this.setState({ shouldRender: true })),
    )
  }

  componentWillUnmount() {
    this._mounted = false
  }

  _mounted = false

  render() {
    const { children } = this.props
    const { shouldRender } = this.state

    return shouldRender ? children : null
  }
}

export default Defer
