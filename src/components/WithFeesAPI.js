// @flow
import { Component } from 'react'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { getEstimatedFees } from '@ledgerhq/live-common/lib/api/Fees'
import type { Fees } from '@ledgerhq/live-common/lib/api/Fees'

// FIXME we need to abstract this out like we did for CounterValues
export default class WithFeesAPI extends Component<
  {
    currency: Currency,
    render: Fees => *,
    renderLoading: () => *,
    renderError: Error => *,
  },
  { fees: ?Fees, error: ?Error },
> {
  state = {
    fees: null,
    error: null,
  }
  componentDidMount() {
    this.load()
  }
  componentWillUnmount() {
    this._unmounted = true
  }
  _unmounted = false
  async load() {
    const { currency } = this.props
    try {
      const fees = await getEstimatedFees(currency)
      if (!this._unmounted) this.setState({ error: null, fees })
    } catch (error) {
      if (!this._unmounted) this.setState({ error, fees: null })
    }
  }
  render() {
    const { render, renderError, renderLoading } = this.props
    const { fees, error } = this.state
    return error ? renderError(error) : fees ? render(fees) : renderLoading()
  }
}
