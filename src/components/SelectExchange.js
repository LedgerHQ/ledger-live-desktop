// @flow
import React, { Component } from 'react'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import type { Exchange } from '@ledgerhq/live-common/lib/countervalues/types'
import Select from 'components/base/LegacySelect'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import CounterValues from 'helpers/countervalues'

const renderItem = ex => (
  <Box grow horizontal alignItems="center" flow={2}>
    <Text ff="Open Sans|SemiBold" color="dark" fontSize={4}>
      {ex.name}
    </Text>
  </Box>
)

class ExchangeSelect extends Component<
  {
    from: Currency,
    to: Currency,
    exchangeId: string,
    onChange: (?Exchange) => void,
    style?: *,
  },
  {
    prevFromTo: string,
    exchanges: ?(Exchange[]),
    error: ?Error,
  },
> {
  static getDerivedStateFromProps(nextProps: *, prevState: *) {
    const fromTo = `${nextProps.from.ticker}/${nextProps.to.ticker}`
    if (fromTo !== prevState.prevFromTo) {
      return {
        prevFromTo: fromTo,
        exchanges: null,
      }
    }
    return null
  }

  state = {
    prevFromTo: '', // eslint-disable-line
    exchanges: null,
    error: null,
  }

  componentDidMount() {
    this._load()
  }

  componentDidUpdate() {
    if (this.state.exchanges === null) {
      this._load()
    }
  }

  componentWillUnmount() {
    this._unmounted = true
  }
  _unmounted = false

  _loadId = 0
  async _load() {
    this._loadId++
    if (this._unmounted) return
    this.setState({ exchanges: [] })
    const { _loadId } = this
    const { from, to } = this.props
    try {
      const exchanges = await CounterValues.fetchExchangesForPair(from, to)
      if (!this._unmounted && this._loadId === _loadId) {
        this.setState({ exchanges })
      }
    } catch (error) {
      console.error(error)
      if (!this._unmounted && this._loadId === _loadId) {
        this.setState({ error })
      }
    }
  }

  render() {
    const { onChange, exchangeId, style } = this.props
    const { exchanges, error } = this.state
    return exchanges && exchanges.length > 0 ? (
      <Select
        style={style}
        value={exchanges.find(e => e.id === exchangeId)}
        renderSelected={renderItem}
        renderItem={renderItem}
        keyProp="id"
        items={exchanges}
        fontSize={4}
        onChange={onChange}
      />
    ) : error ? (
      <Text ff="Open Sans|SemiBold" color="dark" fontSize={4}>
        Failed to load.
      </Text>
    ) : (
      <Text ff="Open Sans|SemiBold" color="dark" fontSize={4}>
        Loading...
      </Text>
    )
  }
}

export default ExchangeSelect
