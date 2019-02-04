// @flow

import React, { PureComponent } from 'react'
import WebSocket from 'ws'
import IP from 'ip'
import { createStructuredSelector } from 'reselect'
import { activeAccountsSelector } from 'reducers/accounts'
import { exportSettingsSelector } from 'reducers/settings'
import { encode } from '@ledgerhq/live-common/lib/cross'
import connect from 'react-redux/es/connect/connect'
import Button from '../base/Button'
import QRCode from '../base/QRCode'

type Props = {
  accounts: *,
  settings: *,
}

type State = {
  active: boolean,
}

const mapStateToProps = createStructuredSelector({
  accounts: activeAccountsSelector,
  settings: exportSettingsSelector,
})

class SocketExport extends PureComponent<Props, State> {
  state = {
    active: false,
  }

  componentWillMount() {
    this.resetServer()
  }

  componentDidUpdate() {
    if (!this.state.active) return
    if (!this.server) {
      this.resetServer()
    }
  }

  componentWillUnmount() {
    if (this.server) this.server.close()
  }

  resetServer = () => {
    this.server = new WebSocket.Server({ port: 1234 })

    const { accounts, settings } = this.props

    const data = encode({
      accounts,
      settings,
      exporterName: 'desktop',
      exporterVersion: __APP_VERSION__,
    })

    // Secret handshake to avoid intruders
    this.secret = Math.random()
      .toString(36)
      .slice(2)

    if (this.server) {
      this.server.on('connection', ws => {
        ws.on('message', message => {
          if (message === this.secret) {
            ws.send(data)
            ws.close()
            this.setState({ active: false })
            this.server = undefined
          }
        })
      })
    }
  }

  secret: string
  server: *
  canvas = React.createRef()

  render() {
    return this.state.active ? (
      <QRCode size={50} data={`${this.secret}~${IP.address()}`} />
    ) : (
      <Button primary small onClick={() => this.setState({ active: true })}>
        {'Generate Code'}
      </Button>
    )
  }
}

export default connect(mapStateToProps)(SocketExport)
