// @flow
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import LRU from "lru-cache";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import type { Exchange } from "@ledgerhq/live-common/lib/countervalues/types";
import logger from "~/logger";
import Track from "~/renderer/analytics/Track";
import CounterValues from "~/renderer/countervalues";
import Select from "~/renderer/components/Select";
import Box from "~/renderer/components/Box";
import TranslatedError from "~/renderer/components/TranslatedError";

const cache = new LRU({ max: 100 });

const getExchanges = (from: Currency, to: Currency) => {
  const key = `${from.ticker}_${to.ticker}`;
  let promise = cache.get(key);
  if (promise) return promise;
  promise = CounterValues.fetchExchangesForPair(from, to);
  promise.catch(() => cache.del(key)); // if it's a failure, we don't want to keep the cache
  cache.set(key, promise);
  return promise;
};

type Props = {
  from: Currency,
  to: Currency,
  exchangeId: ?string,
  onChange: (?Exchange) => void,
  style?: *,
  t: TFunction,
};

type State = {
  prevFromTo: string,
  exchanges: ?(Exchange[]),
  error: ?Error,
  isLoading: boolean,
};

class SelectExchange extends Component<Props, State> {
  state = {
    prevFromTo: "",
    exchanges: null,
    error: null,
    isLoading: false,
  };

  static getDerivedStateFromProps(nextProps: *, prevState: *) {
    const fromTo = `${nextProps.from.ticker}/${nextProps.to.ticker}`;
    if (fromTo !== prevState.prevFromTo) {
      return {
        prevFromTo: fromTo,
        exchanges: null,
      };
    }
    return null;
  }

  componentDidMount() {
    this._load();
  }

  componentDidUpdate() {
    if (this.state.exchanges === null) {
      this._load();
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  _unmounted = false;

  _loadId = 0;
  async _load() {
    this._loadId++;
    if (this._unmounted) return;
    this.setState({ exchanges: [], isLoading: true });
    const { _loadId } = this;
    const { from, to } = this.props;
    try {
      const exchanges = await getExchanges(from, to);
      if (!this._unmounted && this._loadId === _loadId) {
        this.setState({ exchanges, isLoading: false });
      }
    } catch (error) {
      logger.critical(error);
      if (!this._unmounted && this._loadId === _loadId) {
        this.setState({ error, isLoading: false });
      }
    }
  }

  render() {
    const { onChange, exchangeId, style, t, from, to, ...props } = this.props;
    const { exchanges, error, isLoading } = this.state;

    const options = exchanges
      ? // $FlowFixMe WTF flow
        exchanges.map((e: Exchange) => ({ value: e.id, label: e.name, ...e }))
      : [];
    const value = options.find(e => e.id === exchangeId);

    const noExchanges = options.length === 0;

    // $FlowFixMe
    return error && error.status !== 400 ? (
      <Box
        style={{ wordWrap: "break-word", width: 250 }}
        color="alertRed"
        ff="Inter|SemiBold"
        fontSize={3}
        textAlign="center"
      >
        <TranslatedError error={error} />
      </Box>
    ) : (
      <>
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
          isDisabled={noExchanges}
          placeholder={
            noExchanges ? t("common.selectExchangeNoOptionAtAll") : t("common.selectExchange")
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue
              ? t("common.selectExchangeNoOption", { exchangeName: inputValue })
              : t("common.selectExchangeNoOptionAtAll")
          }
          // $FlowFixMe Goddamn it spread props
          {...props}
        />
      </>
    );
  }
}

export default withTranslation()(SelectExchange);
