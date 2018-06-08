// @flow
import { PureComponent } from 'react'
import isEqual from 'lodash/isEqual'

import type { Node } from 'react'
import type { Device } from 'types/common'

import getIsGenuine from 'commands/getIsGenuine'

type Error = {
  message: string,
  stack: string,
}

type Props = {
  device: ?Device,
  children: (isGenuine: ?boolean, error: ?Error) => Node,
}

type State = {
  genuine: ?boolean,
  error: ?Error,
}

class EnsureGenuine extends PureComponent<Props, State> {
  static defaultProps = {
    children: () => null,
    firmwareInfo: null,
  }

  state = {
    error: null,
    genuine: null,
  }

  componentDidMount() {
    this.checkIsGenuine()
  }

  componentDidUpdate() {
    this.checkIsGenuine()
  }

  componentWillUnmount() {
    this._unmounting = true
  }

  _checking = false
  _unmounting = false

  async checkIsGenuine() {
    const { device } = this.props
    if (device && !this._checking) {
      this._checking = true
      try {
        const isGenuine = await getIsGenuine.send().toPromise()
        if (!this.state.genuine || this.state.error) {
          !this._unmounting && this.setState({ genuine: isGenuine, error: null })
        }
      } catch (err) {
        if (!isEqual(this.state.error, err)) {
          !this._unmounting && this.setState({ genuine: false, error: err })
        }
      }
      this._checking = false
    }
  }

  render() {
    const { error, genuine } = this.state
    const { children } = this.props

    return children(genuine, error)
  }
}

export default EnsureGenuine
