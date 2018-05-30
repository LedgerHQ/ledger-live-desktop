// @flow
import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'
import isEqual from 'lodash/isEqual'

import type { Node } from 'react'
import type { Device, T } from 'types/common'

import getIsGenuine from 'commands/getIsGenuine'

type Props = {
  t: T,
  device: Device,
  children: Node,
}

type State = {
  genuine: boolean,
  error: ?{
    message: string,
    stack: string,
  },
}

class EnsureGenuine extends PureComponent<Props, State> {
  static defaultProps = {
    children: null,
    firmwareInfo: null,
  }

  state = {
    error: null,
    genuine: false,
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
    const { children, t } = this.props

    if (genuine) {
      return children
    }

    return error ? (
      <Fragment>
        <span>{error.message}</span>
        <span>{t('manager:errors.noGenuine')}</span>
      </Fragment>
    ) : null
  }
}

export default translate()(EnsureGenuine)
