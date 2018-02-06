// @flow

import { PureComponent } from 'react'

type Props = {
  children: any,
}

type State = {
  show: boolean,
}

class Defer extends PureComponent<Props, State> {
  state = {
    show: false,
  }

  componentDidMount() {
    window.requestAnimationFrame(() =>
      this.setState({
        show: true,
      }),
    )
  }

  render() {
    const { children } = this.props
    const { show } = this.state

    if (show) {
      return children
    }

    return null
  }
}

export default Defer
