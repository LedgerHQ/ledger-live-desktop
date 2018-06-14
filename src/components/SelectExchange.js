// @flow
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import type { Exchange } from '@ledgerhq/live-common/lib/countervalues/types'
import logger from 'logger'

import Select from 'components/base/Select'
import Text from 'components/base/Text'
import CounterValues from 'helpers/countervalues'
import type { T } from 'types/common'

class SelectExchange extends Component<
  {
    from: Currency,
    to: Currency,
    exchangeId: ?string,
    onChange: (?Exchange) => void,
    style?: *,
    t: T,
  },
  {
    prevFromTo: string,
    exchanges: ?(Exchange[]),
    error: ?Error,
  },
> {
  state = {
    prevFromTo: '', // eslint-disable-line
    exchanges: null,
    error: null,
  }

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
      logger.error(error)
      if (!this._unmounted && this._loadId === _loadId) {
        this.setState({ error })
      }
    }
  }

  render() {
    const { onChange, exchangeId, style, t, ...props } = this.props
    const { exchanges, error } = this.state

    const options = exchanges ? exchanges.map(e => ({ value: e.id, label: e.name, ...e })) : []

    return error ? (
      <Text ff="Open Sans|SemiBold" color="dark" fontSize={4}>
        {t('app:common.error.load')}
      </Text>
    ) : (
      <Select
        value={options.find(e => e.id === exchangeId)}
        options={options}
        onChange={onChange}
        isLoading={options.length === 0}
        {...props}
      />
    )
  }
}

export default translate()(SelectExchange)
