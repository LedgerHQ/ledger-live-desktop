// @flow
import { PureComponent } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'
import type { WalletBridge } from 'bridge/types'

type Props = {
  onSuccess: (txid: string) => void,
  render: ({ error: ?Error }) => React$Node,
  device: Device,
  account: Account,
  bridge: WalletBridge<*>,
  transaction: *,
}

type State = {
  error: ?Error,
}

class DeviceSignTransaction extends PureComponent<Props, State> {
  state = {
    error: null,
  }

  componentDidMount() {
    this.sign()
  }

  componentWillUnmount() {
    this.unmount = true
  }
  unmount = false

  sign = async () => {
    const { device, account, transaction, bridge, onSuccess } = this.props
    try {
      const txid = await bridge.signAndBroadcast(account, transaction, device.path)
      onSuccess(txid)
    } catch (error) {
      this.setState({ error })
    }
  }

  render() {
    const { render } = this.props
    const { error } = this.state
    return render({ error })
  }
}

export default DeviceSignTransaction
