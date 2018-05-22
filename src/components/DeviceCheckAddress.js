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

  componentDidUnmount() {
    if (this.sub) this.sub.unsubscribe()
  }

  sub: *

  verifyAddress = ({ device, account }: { device: Device, account: Account }) => {
    this.sub = getAddress
      .send({
        currencyId: account.currency.id,
        devicePath: device.path,
        path: account.path,
        segwit: account.isSegwit,
        verify: true,
      })
      .subscribe({
        next: () => {
          this.setState({
            isVerified: true,
          })
          this.props.onCheck(true)
        },
        error: () => {
          this.setState({
            isVerified: false,
          })
          this.props.onCheck(false)
        },
      })
  }

  render() {
    const { render } = this.props
    const { isVerified } = this.state

    return render({ isVerified })
  }
}

export default CheckAddress
