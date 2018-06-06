// @flow

import { PureComponent } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import getAddress from 'commands/getAddress'

type Props = {
  onCheck: boolean => void,
  render: ({ isVerified?: ?boolean }) => *,
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
    this.verifyAddress({ device, account })
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  _isUnmounted = false

  verifyAddress = async ({ device, account }: { device: Device, account: Account }) => {
    try {
      const { address } = await getAddress
        .send({
          currencyId: account.currency.id,
          devicePath: device.path,
          path: account.freshAddressPath,
          segwit: !!account.isSegwit,
          verify: true,
        })
        .toPromise()

      if (address !== account.freshAddress) {
        throw new Error('Confirmed address is different')
      }

      if (this._isUnmounted) {
        return
      }
      this.setState({ isVerified: true })
      this.props.onCheck(true)
    } catch (err) {
      if (this._isUnmounted) {
        return
      }
      this.setState({ isVerified: false })
      this.props.onCheck(false)
    }
  }

  render() {
    const { render } = this.props
    const { isVerified } = this.state

    return render({ isVerified })
  }
}

export default CheckAddress
