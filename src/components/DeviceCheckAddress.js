// @flow

import { PureComponent } from 'react'
import { ipcRenderer } from 'electron'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import { sendEvent } from 'renderer/events'

type Props = {
  onCheck: Function,
  render: Function,
  account: Account,
  device: Device,
}

type State = {
  isVerified: null | boolean,
}

class CheckAddress extends PureComponent<Props, State> {
  state = {
    isVerified: null,
  }

  componentDidMount() {
    const { device, account } = this.props
    ipcRenderer.on('msg', this.handleMsgEvent)
    this.verifyAddress({ device, account })
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleMsgEvent)
  }

  handleMsgEvent = (e: any, { type }: { type: string }) => {
    const { onCheck } = this.props

    if (type === 'accounts.verifyAddress.success') {
      this.setState({
        isVerified: true,
      })
      onCheck(true)
    }

    if (type === 'accounts.verifyAddress.fail') {
      this.setState({
        isVerified: false,
      })
      onCheck(false)
    }
  }

  verifyAddress = ({ device, account }: { device: Device, account: Account }) =>
    sendEvent('accounts', 'verifyAddress', {
      pathDevice: device.path,
      path: account.path,
      segwit: account.path.startsWith("49'"), // TODO: store segwit info in account
    })

  render() {
    const { render } = this.props
    const { isVerified } = this.state

    return render({ isVerified })
  }
}

export default CheckAddress
