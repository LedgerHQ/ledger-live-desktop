// @flow

import React, { useState, useCallback, useEffect, useMemo, useReducer } from "react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import { BigNumber } from "bignumber.js";
import TrackPage from "~/renderer/analytics/TrackPage";
import { useSelector, useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/Box/Card";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { modalsStateSelector } from "~/renderer/reducers/modals";
import type {
  CryptoCurrency,
  TokenCurrency,
  Account,
  AccountLike,
  Currency,
} from "@ledgerhq/live-common/lib/types";
import getExchangeRates from "@ledgerhq/live-common/lib/exchange/swap/getExchangeRates";
import { getAbandonSeedAddress } from "@ledgerhq/live-common/lib/currencies";
import ArrowSeparator from "~/renderer/components/ArrowSeparator";
import { swapSupportedCurrenciesSelector } from "~/renderer/reducers/settings";
import {
  canRequestRates,
  getCurrenciesWithStatus,
  initState,
  reducer,
} from "@ledgerhq/live-common/lib/exchange/swap/logic";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { InstalledItem } from "@ledgerhq/live-common/lib/apps";
import Box from "~/renderer/components/Box";

import From from "~/renderer/screens/exchange/swap/Form/From";
import To from "~/renderer/screens/exchange/swap/Form/To";
import Footer from "~/renderer/screens/exchange/swap/Form/Footer";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Tooltip from "~/renderer/components/Tooltip";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import { colors } from "~/renderer/styles/theme";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import type { CurrencyStatus } from "@ledgerhq/live-common/lib/exchange/swap/logic";

type Props = {
  installedApps: InstalledItem[],
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?AccountLike,
  defaultParentAccount?: ?Account,
  setTabIndex: number => void,
};

const Form = ({
  installedApps,
  defaultCurrency,
  defaultAccount,
  defaultParentAccount,
  setTabIndex,
}: Props) => {
  const accounts = useSelector(shallowAccountsSelector);
  const selectableCurrencies = useSelector(swapSupportedCurrenciesSelector);
  const modalsState = useSelector(modalsStateSelector);

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

  const [state, dispatch] = useReducer(
    reducer,
    // $FlowFixMe Update type for SwapState
    {
      okCurrencies,
      defaultCurrency:
        defaultCurrency && okCurrencies.includes(defaultCurrency) ? defaultCurrency : undefined,
      defaultAccount: defaultAccount?.balance.gt(0) ? defaultAccount : undefined,
      defaultParentAccount: defaultParentAccount || undefined,
    },
    initState,
  );

  const patchExchange = useCallback(payload => dispatch({ type: "patchExchange", payload }), [
    dispatch,
  ]);

  const { swap, fromAmount, fromCurrency, toCurrency, useAllAmount, ratesTimestamp, error } = state;
  const ratesExpirationThreshold = 60000;

  const { exchange, exchangeRate } = swap;
  const [isTimerVisible, setTimerVisibility] = useState(true);
  const { fromAccount, fromParentAccount, toAccount, toParentAccount } = exchange;
  const { status, setTransaction, setAccount, transaction, bridgePending } = useBridgeTransaction();

  const ratesExpiration = useMemo(
    () => (ratesTimestamp ? new Date(ratesTimestamp.getTime() + ratesExpirationThreshold) : null),
    [ratesTimestamp],
  );

  const onCompleteSwap = useCallback(() => setTabIndex(1), [setTabIndex]);
  const onStartSwap = useCallback(() => {
    setTimerVisibility(false);
    reduxDispatch(openModal("MODAL_SWAP", { swap, transaction, ratesExpiration, onCompleteSwap }));
  }, [onCompleteSwap, ratesExpiration, reduxDispatch, swap, transaction]);

  const { magnitudeAwareRate } = exchangeRate || {};

  useEffect(() => setAccount(fromAccount, fromParentAccount), [
    fromAccount,
    fromParentAccount,
    setAccount,
  ]);

  useEffect(() => {
    if (!fromAccount || !transaction) return;
    if (transaction.amount && !transaction.amount.eq(fromAmount)) {
      const bridge = getAccountBridge(fromAccount, fromParentAccount);
      const mainAccount = getMainAccount(fromAccount, fromParentAccount);
      const currency = getAccountCurrency(mainAccount);

      setTransaction(
        bridge.updateTransaction(transaction, {
          amount: fromAmount,
          subAccountId: fromParentAccount ? fromAccount.id : null,
          recipient: getAbandonSeedAddress(currency.id),
        }),
      );
    }
  }, [fromAccount, fromAmount, fromParentAccount, setAccount, setTransaction, transaction]);

  const _canRequestRates = useMemo(() => canRequestRates(state), [state]);

  useEffect(() => {
    let ignore = false;
    async function getRates() {
      try {
        if (!transaction) return;
        const rates = await getExchangeRates(exchange, transaction);
        if (ignore) return;
        dispatch({ type: "setRate", payload: { rate: rates[0] } });
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
    async function getEstimatedMaxSpendable() {
      const newUseAllAmount = !useAllAmount;
      if (newUseAllAmount) {
        const bridge = getAccountBridge(fromAccount, fromParentAccount);
        const fromAmount = await bridge.estimateMaxSpendable({
          account: fromAccount,
          parentAccount: fromParentAccount,
          transaction,
        });
        dispatch({ type: "setFromAmount", payload: { fromAmount, useAllAmount: true } });
      } else {
        dispatch({ type: "setFromAmount", payload: { fromAmount: BigNumber(0) } });
      }
    }
    getEstimatedMaxSpendable();
  }, [fromAccount, fromParentAccount, transaction, useAllAmount]);

  const expireRates = useCallback(() => {
    if (!modalsState.MODAL_SWAP || !modalsState.MODAL_SWAP.isOpened) {
      // NB Modal is closed, show the timer for the Form component again.
      setTimerVisibility(true);
      // NB Don't expire the rates if the modal is open, we freeze on modal flow launch.
      dispatch({ type: "expireRates", payload: {} });
    }
  }, [modalsState]);

  useEffect(() => {
    expireRates();
  }, [expireRates, modalsState]);

  const validToCurrencies = useMemo(() => selectableCurrencies.filter(c => c !== fromCurrency), [
    fromCurrency,
    selectableCurrencies,
  ]);

  const hasErrors = Object.keys(status.errors).length;
  const canContinue = !bridgePending && !hasErrors && exchangeRate;
  return (
    <>
      <TrackPage category="Swap" name="Form" />
      <Card flow={1}>
        <Box horizontal p={32}>
          <From
            status={status}
            key={fromCurrency?.id || "from"}
            currenciesStatus={currenciesStatus}
            account={fromAccount ? getMainAccount(fromAccount, fromParentAccount) : null}
            amount={fromAmount}
            currency={fromCurrency}
            error={error}
            currencies={selectableCurrencies}
            onCurrencyChange={fromCurrency => {
              dispatch({ type: "setFromCurrency", payload: { fromCurrency } });
            }}
            onAccountChange={(fromAccount, fromParentAccount) =>
              dispatch({ type: "setFromAccount", payload: { fromAccount, fromParentAccount } })
            }
            onAmountChange={fromAmount => {
              dispatch({ type: "setFromAmount", payload: { fromAmount } });
            }}
            useAllAmount={useAllAmount}
            onToggleUseAllAmount={toggleUseAllAmount}
          />
          <ArrowSeparator Icon={IconArrowRight} />
          <To
            key={toCurrency?.id || "to"}
            currenciesStatus={currenciesStatus}
            account={toAccount ? getMainAccount(toAccount, toParentAccount) : null}
            amount={fromAmount ? fromAmount.times(magnitudeAwareRate) : null}
            currency={toCurrency}
            fromCurrency={fromCurrency}
            rate={magnitudeAwareRate}
            currencies={validToCurrencies}
            onCurrencyChange={toCurrency =>
              dispatch({ type: "setToCurrency", payload: { toCurrency } })
            }
            onAccountChange={(toAccount, toParentAccount) =>
              patchExchange({ toAccount, toParentAccount })
            }
          />
        </Box>
        <Footer
          onExpireRates={expireRates}
          onStartSwap={onStartSwap}
          canContinue={canContinue}
          ratesExpiration={isTimerVisible ? ratesExpiration : null}
        />
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

export default Form;
