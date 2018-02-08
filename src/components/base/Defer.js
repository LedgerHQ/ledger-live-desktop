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
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => this.setState({ shouldRender: true })),
    )
  }

  render() {
    const { children } = this.props
    const { shouldRender } = this.state

    return shouldRender ? children : null
  }
}

export default Defer
