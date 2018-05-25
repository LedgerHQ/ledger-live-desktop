// @flow
import { PureComponent } from 'react'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'
import type { WalletBridge } from 'bridge/types'

type Props = {
  onOperationBroadcasted: (op: Operation) => void,
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
    const { device, account, transaction, bridge, onOperationBroadcasted } = this.props
    try {
      const optimisticOperation = await bridge.signAndBroadcast(account, transaction, device.path)
      onOperationBroadcasted(optimisticOperation)
    } catch (error) {
      console.warn(error)
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
