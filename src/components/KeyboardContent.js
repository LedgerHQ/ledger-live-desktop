// @flow
// Toggle something after a sequence of keyboard

import { Component } from 'react'

class KeyboardContent extends Component<
  {
    sequence: string,
    children: React$Node,
  },
  { enabled: boolean },
> {
  state = {
    enabled: false,
  }

  componentDidMount() {
    window.addEventListener('keypress', this.onKeyPress)
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.onKeyPress)
  }

  seqIndex = -1
  onKeyPress = (e: *) => {
    const { sequence } = this.props
    const next = sequence[this.seqIndex + 1]
    if (next && next === e.key) {
      this.seqIndex++
    } else {
      this.seqIndex = -1
    }
    if (this.seqIndex === sequence.length - 1) {
      this.seqIndex = -1
      this.setState(({ enabled }) => ({ enabled: !enabled }))
    }
  }

  render() {
    const { children } = this.props
    const { enabled } = this.state
    return enabled ? children : null
  }
}

export default KeyboardContent
