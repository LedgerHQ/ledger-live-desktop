// @flow
import React, { Fragment, Component } from 'react'
import { translate } from 'react-i18next'
import LRU from 'lru-cache'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import type { Exchange } from '@ledgerhq/live-common/lib/countervalues/types'
import logger from 'logger'

import Track from 'analytics/Track'
import Select from 'components/base/Select'
import Box from 'components/base/Box'
import TranslatedError from 'components/TranslatedError'
import CounterValues from 'helpers/countervalues'
import type { T } from 'types/common'

const cache = LRU({ max: 100 })

const getExchanges = (from: Currency, to: Currency) => {
  const key = `${from.ticker}_${to.ticker}`
  let promise = cache.get(key)
  if (promise) return promise
  promise = CounterValues.fetchExchangesForPair(from, to)
  promise.catch(() => cache.del(key)) // if it's a failure, we don't want to keep the cache
  cache.set(key, promise)
  return promise
}

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
    isLoading: boolean,
  },
> {
  state = {
    prevFromTo: '', // eslint-disable-line
    exchanges: null,
    error: null,
    isLoading: false,
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
    this.setState({ exchanges: [], isLoading: true })
    const { _loadId } = this
    const { from, to } = this.props
    try {
      const exchanges = await getExchanges(from, to)
      if (!this._unmounted && this._loadId === _loadId) {
        this.setState({ exchanges, isLoading: false })
      }
    } catch (error) {
      logger.critical(error)
      if (!this._unmounted && this._loadId === _loadId) {
        this.setState({ error, isLoading: false })
      }
    }
  }

  render() {
    const { onChange, exchangeId, style, t, from, to, ...props } = this.props
    const { exchanges, error, isLoading } = this.state

    const options = exchanges ? exchanges.map(e => ({ value: e.id, label: e.name, ...e })) : []
    const value = options.find(e => e.id === exchangeId)

    return error ? (
      <Box
        style={{ wordWrap: 'break-word', width: 250 }}
        color="alertRed"
        ff="Open Sans|SemiBold"
        fontSize={3}
        textAlign="center"
      >
        <TranslatedError error={error} />
      </Box>
    ) : (
      <Fragment>
        {exchanges ? (
          <Track
            onUpdate
            event="SelectExchange"
            exchangeName={value && value.id}
            fromCurrency={from.ticker}
            toCurrency={to.ticker}
          />
        ) : null}
        <Select
          value={value}
          options={options}
          onChange={onChange}
          isLoading={isLoading}
          placeholder={t('common.selectExchange')}
          noOptionsMessage={({ inputValue }) =>
            inputValue
              ? t('common.selectExchangeNoOption', { exchangeName: inputValue })
              : t('common.selectExchangeNoOptionAtAll')
          }
          {...props}
        />
      </Fragment>
    )
  }
}

export default translate()(SelectExchange)
