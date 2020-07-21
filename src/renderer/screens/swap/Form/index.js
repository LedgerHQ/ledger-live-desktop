// @flow

import React, { useState, useCallback, useEffect, useMemo, useReducer } from "react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import { BigNumber } from "bignumber.js";
import uniq from "lodash/uniq";
import { connect, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Trans, useTranslation, withTranslation } from "react-i18next";
import Card from "~/renderer/components/Box/Card";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import type { AccountLike, Currency } from "@ledgerhq/live-common/lib/types";
import getExchangeRates from "@ledgerhq/live-common/lib/swap/getExchangeRates";
import ArrowSeparator from "~/renderer/components/ArrowSeparator";
import { findTokenById } from "@ledgerhq/live-common/lib/data/tokens";
import useInterval from "~/renderer/hooks/useInterval";
import {
  findCryptoCurrencyById,
  isCurrencySupported,
} from "@ledgerhq/live-common/lib/data/cryptocurrencies";
import {
  canRequestRates,
  getCurrenciesWithStatus,
  initState,
  reducer,
} from "@ledgerhq/live-common/lib/swap/logic";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { flattenAccounts, getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { InstalledItem } from "@ledgerhq/live-common/lib/apps";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { openURL } from "~/renderer/linking";

import { track } from "~/renderer/analytics/segment";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";
import From from "~/renderer/screens/swap/Form/From";
import To from "~/renderer/screens/swap/Form/To";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Tooltip from "~/renderer/components/Tooltip";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import { colors } from "~/renderer/styles/theme";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import type { CurrencyStatus } from "@ledgerhq/live-common/lib/swap/logic";
import { urls } from "~/config/urls";

const Footer: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  justify-content: space-between;
  padding: 20px;
`;

const isSameCurrencyFilter = currency => a => {
  const accountCurrency = getAccountCurrency(a);
  return (
    currency &&
    (currency === accountCurrency ||
      (currency.type === "TokenCurrency" && currency.parentCurrency === accountCurrency))
  );
};

const Form = ({
  accounts,
  selectableCurrencies,
  installedApps,
}: {
  accounts: AccountLike[],
  onContinue: any,
  selectableCurrencies: Currency[],
  installedApps: InstalledItem[],
}) => {
  const ratesExpirationThreshold = 100000;
  const { t } = useTranslation();
  const reduxDispatch = useDispatch();
  const currenciesStatus = useMemo(
    () =>
      getCurrenciesWithStatus({
        accounts,
        installedApps,
        selectableCurrencies,
      }),
    [accounts, installedApps, selectableCurrencies],
  );
  const okCurrencies = selectableCurrencies.filter(
    c =>
      (c.type === "TokenCurrency" || c.type === "CryptoCurrency") &&
      currenciesStatus[c.id] === "ok",
  );

  const [state, dispatch] = useReducer(reducer, { okCurrencies }, initState);
  const [ratesTimestamp, setRatesTimestamp] = useState(null); // Move back to the live-common one
  const patchExchange = useCallback(payload => dispatch({ type: "patchExchange", payload }), [
    dispatch,
  ]);

  const {
    swap,
    fromAmount,
    fromCurrency,
    toCurrency,
    useAllAmount,
    /* ratesTimestamp, */ error,
  } = state;
  const { exchange, exchangeRate } = swap;
  const { fromAccount, toAccount } = exchange;
  const { setTransaction, setAccount, transaction } = useBridgeTransaction();

  const onStartSwap = useCallback(() => {
    reduxDispatch(openModal("MODAL_SWAP", { swap, transaction }));
  }, [reduxDispatch, swap, transaction]);

  const validFrom = useMemo(() => accounts.filter(isSameCurrencyFilter(fromCurrency)), [
    accounts,
    fromCurrency,
  ]);

  const validTo = useMemo(() => accounts.filter(isSameCurrencyFilter(toCurrency)), [
    accounts,
    toCurrency,
  ]);

  const { magnitudeAwareRate } = exchangeRate || {};

  useEffect(() => setAccount(fromAccount), [fromAccount, setAccount]);
  useEffect(() => {
    if (!fromAccount || !transaction) return;
    if (transaction.amount && !transaction.amount.eq(fromAmount)) {
      const bridge = getAccountBridge(fromAccount); // TODO token support
      setTransaction(bridge.updateTransaction(transaction, { amount: fromAmount }));
    }
  }, [fromAccount, fromAmount, setAccount, setTransaction, transaction]);

  useEffect(() => {
    dispatch({
      type: "setFromAccount",
      payload: {
        fromAccount:
          flattenAccounts(validFrom).find(a => getAccountCurrency(a) === fromCurrency) || null,
      },
    });
  }, [fromCurrency, patchExchange, validFrom, dispatch]);

  useEffect(() => patchExchange({ toAccount: validTo[0] || null }), [patchExchange, validTo]);
  const _canRequestRates = useMemo(() => canRequestRates(state), [state]);

  useEffect(() => {
    let ignore = false;
    async function getRates() {
      try {
        if (!transaction) return;
        const rates = await getExchangeRates(exchange, transaction);
        if (ignore) return;
        dispatch({ type: "setRate", payload: { rate: rates[0] } });
        setRatesTimestamp(new Date());
      } catch (error) {
        if (ignore) return;
        dispatch({ type: "setError", payload: { error } });
      }
    }
    if (!ignore && !exchangeRate && _canRequestRates) {
      getRates();
    }

    return () => {
      ignore = true;
    };
  }, [_canRequestRates, exchange, exchangeRate, transaction]);

  // Not to be confused with the useAllAmount flag for a regular transaction.
  // We need this because the providers require an exact amount to lock a rate.
  const toggleUseAllAmount = useCallback(() => {
    let ignore = false;
    async function getEstimatedMaxSpendable() {
      const newUseAllAmount = !useAllAmount;
      if (newUseAllAmount) {
        const bridge = await getAccountBridge(fromAccount);
        const fromAmount = await bridge.estimateMaxSpendable({ account: fromAccount });
        dispatch({ type: "setFromAmount", payload: { fromAmount, useAllAmount: true } });
      } else {
        dispatch({ type: "setFromAmount", payload: { fromAmount: BigNumber(0) } });
      }
    }
    if (!ignore) {
      getEstimatedMaxSpendable();
    }
    return () => {
      ignore = true;
    };
  }, [fromAccount, useAllAmount]);

  // Re-fetch rates (if needed) every `ratesExpirationThreshold` seconds.
  useInterval(() => {
    const now = new Date();
    console.log({ ratesTimestamp, ratesExpirationThreshold });
    if (ratesTimestamp && now - ratesTimestamp > ratesExpirationThreshold) {
      dispatch({ type: "expireRates", payload: {} });
      console.log("expiring rates");
    }
  }, 5000);

  if (!fromAccount) return null;

  return (
    <>
      <Card flow={1}>
        <Box horizontal p={32}>
          <From
            currenciesStatus={currenciesStatus}
            account={fromAccount}
            amount={fromAmount}
            currency={fromCurrency}
            error={error}
            currencies={selectableCurrencies}
            onCurrencyChange={_fromCurrency => {
              // FIXME this doesnt work with tokens
              if (fromCurrency.id !== _fromCurrency.id) {
                dispatch({ type: "setFromCurrency", payload: { fromCurrency: _fromCurrency } });
              }
            }}
            onAccountChange={a => dispatch({ type: "setFromAccount", payload: { fromAccount: a } })}
            onAmountChange={fromAmount =>
              dispatch({ type: "setFromAmount", payload: { fromAmount } })
            }
            validAccounts={validFrom}
            useAllAmount={useAllAmount}
            onToggleUseAllAmount={toggleUseAllAmount}
          />
          <ArrowSeparator Icon={IconArrowRight} />
          {toCurrency && fromCurrency ? (
            <To
              currenciesStatus={currenciesStatus}
              account={toAccount}
              amount={fromAmount ? fromAmount.times(magnitudeAwareRate) : null}
              currency={toCurrency}
              fromCurrency={fromCurrency}
              rate={magnitudeAwareRate}
              currencies={selectableCurrencies.filter(c => c !== fromCurrency)}
              onCurrencyChange={toCurrency =>
                dispatch({ type: "setToCurrency", payload: { toCurrency } })
              }
              onAccountChange={a => patchExchange({ toAccount: a })}
              validAccounts={validTo}
            />
          ) : null}
        </Box>
        <Footer horizontal>
          <LabelWithExternalIcon
            color="wallet"
            ff="Inter|SemiBold"
            onClick={() => {
              openURL(urls.swap.info);
              track("More info on swap");
            }}
            label={t("swap.form.helpCTA")}
          />
          <Button onClick={onStartSwap} primary disabled={!exchangeRate}>
            {"Exchange"}
          </Button>
        </Footer>
      </Card>
    </>
  );
};

export const CurrencyOptionRow = ({
  status,
  circle,
  currency,
}: {
  status: CurrencyStatus,
  circle?: boolean,
  currency: Currency,
}) => {
  const notOK = status !== "ok";

  return (
    <Box grow horizontal alignItems="center" flow={2}>
      <CryptoCurrencyIcon
        inactive={notOK}
        circle={circle}
        currency={currency}
        size={circle ? 26 : 16}
      />
      <Box
        grow
        ff="Inter|SemiBold"
        color="palette.text.shade100"
        fontSize={4}
        style={{ opacity: notOK ? 0.2 : 1 }}
      >
        {`${currency.name} (${currency.ticker})`}
      </Box>
      {notOK ? (
        <Box style={{ marginRight: -23 }} alignItems={"flex-end"}>
          <Tooltip
            content={
              <Box p={1} style={{ maxWidth: 120 }}>
                <Text fontSize={2}>
                  <Trans i18nKey={`swap.form.${status}`} values={{ currencyName: currency.name }} />
                </Text>
              </Box>
            }
          >
            <IconExclamationCircle color={colors.orange} size={16} />
          </Tooltip>
        </Box>
      ) : null}
    </Box>
  );
};

const selectableCurrenciesSelector = (state, props) => {
  const { providers } = props;
  const allIds = uniq(
    providers.reduce(
      // FIXME remove this livepeer support
      (ac, { supportedCurrencies }) => [...ac, ...supportedCurrencies, "ethereum/erc20/livepeer"],
      [],
    ),
  );

  const tokenCurrencies = allIds.map(findTokenById).filter(Boolean);
  const cryptoCurrencies = allIds
    .map(findCryptoCurrencyById)
    .filter(Boolean)
    .filter(isCurrencySupported);
  return [...cryptoCurrencies, ...tokenCurrencies];
};

const mapStateToProps = createStructuredSelector({
  accounts: shallowAccountsSelector,
  selectableCurrencies: selectableCurrenciesSelector,
});

export default withTranslation()(connect(mapStateToProps)(Form));
