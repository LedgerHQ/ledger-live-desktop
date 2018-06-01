// @flow
import { PureComponent } from 'react'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'
import type { WalletBridge } from 'bridge/types'

type Props = {
  children: *,
  onOperationBroadcasted: (op: Operation) => void,
  onError: Error => void,
  device: Device,
  account: Account,
  bridge: WalletBridge<*>,
  transaction: *,
}

class DeviceSignTransaction extends PureComponent<Props> {
  componentDidMount() {
    this.sign()
  }

  componentWillUnmount() {
    this.unmount = true
  }
  unmount = false

  sign = async () => {
    const { device, account, transaction, bridge, onOperationBroadcasted, onError } = this.props
    try {
      const optimisticOperation = await bridge.signAndBroadcast(account, transaction, device.path)
      onOperationBroadcasted(optimisticOperation)
    } catch (error) {
      onError(error)
    }
  }

  render() {
    return this.props.children
  }
}

export default DeviceSignTransaction
