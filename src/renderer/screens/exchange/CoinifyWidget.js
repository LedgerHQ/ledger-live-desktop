// @flow

import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import { getConfig } from "~/renderer/screens/exchange/config";
import querystring from "querystring";
import FakeLink from "~/renderer/components/FakeLink";
import { useTranslation } from "react-i18next";
import Reset from "~/renderer/icons/Reset";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";
import { track } from "~/renderer/analytics/segment";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import { parseCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

const WidgetContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const IconContainer: ThemedComponent<{}> = styled.div`
  margin-right: 4px;
`;

const CustomIframe: ThemedComponent<{}> = styled.iframe`
  border: none;
  width: 100%;
  flex: 1;
  transition: opacity 200ms ease-out;
`;

const WidgetFooter: ThemedComponent<{}> = styled.div`
  height: 45px;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${p => p.theme.colors.palette.primary.main};
`;

type CoinifyWidgetConfig = {
  primaryColor?: string,
  partnerId: number,
  cryptoCurrencies?: string | null,
  address?: string | null,
  targetPage: string,
  addressConfirmation?: boolean,
  transferConfirmation?: boolean,
  transferOutMedia?: string,
  transferInMedia?: string,
};

type Props = {
  account?: AccountLike,
  parentAccount?: Account,
  mode: string,
  onReset?: () => void,
};

const CoinifyWidget = ({ account, parentAccount, mode, onReset }: Props) => {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const colors = useTheme("colors");
  const { t } = useTranslation();
  const widgetRef: { current: null | HTMLIFrameElement } = useRef(null);

  const currency = account ? getAccountCurrency(account) : null;
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const coinifyConfig = getConfig();
  const widgetConfig: CoinifyWidgetConfig = {
    //    fontColor: colors.darkBlue,
    primaryColor: colors.wallet,
    partnerId: coinifyConfig.partnerId,
    cryptoCurrencies: currency ? currency.ticker : null,
    address: mainAccount ? mainAccount.freshAddress : null,
    targetPage: mode,
  };

  if (mode === "buy") {
    widgetConfig.transferOutMedia = "blockchain";
    widgetConfig.addressConfirmation = true;
  }

  if (mode === "sell") {
    widgetConfig.transferInMedia = "blockchain";
    widgetConfig.confirmMessages = true;
  }

  if (mode === "trade-history") {
    widgetConfig.transferOutMedia = "";
    widgetConfig.transferInMedia = "";
  }

  console.log(widgetConfig);

  useEffect(() => {
    if (!currency) return;
    if (mode === "buy" && account) {
      track("Coinify Start Buy Widget", { currencyName: currency.name });
    }
    if (mode === "sell" && account) {
      track("Coinify Start Sell Widget", { currencyName: currency.name });
    }
    if (mode === "trade-history") {
      track("Coinify Start History Widget");
    }
  }, [account, currency, mode]);

  const url = `${coinifyConfig.url}?${querystring.stringify(widgetConfig)}`;

  const handleOnResult = useCallback(() => {
    if (mainAccount && widgetRef.current) {
      if (mode === "buy") {
        widgetRef.current.contentWindow.postMessage(
          {
            type: "event",
            event: "trade.receive-account-confirmed",
            context: {
              address: mainAccount.freshAddress,
              status: "accepted",
            },
          },
          coinifyConfig.host,
        );
        if (currency) {
          track("Coinify Confirm Buy End", { currencyName: currency.name });
        }
      }
      if (mode === "sell") {
        widgetRef.current.contentWindow.postMessage(
          {
            type: "event",
            event: "trade.receive-account-confirmed",
            context: {
              address: mainAccount.freshAddress,
              status: "accepted",
            },
          },
          coinifyConfig.host,
        );
        if (currency) {
          track("Coinify Confirm Sell End", { currencyName: currency.name });
        }
      }
    }
  }, [coinifyConfig.host, currency, mainAccount]);

  const handleOnCancel = useCallback(() => {
    if (mainAccount && widgetRef.current) {
      widgetRef.current.contentWindow.postMessage(
        {
          type: "event",
          event: "trade.receive-account-confirmed",
          context: {
            address: mainAccount.freshAddress,
            status: "rejected",
          },
        },
        coinifyConfig.host,
      );
    }
  }, [coinifyConfig.host, mainAccount]);

  const setTransactionId = useCallback(txId => {
    return new Promise(resolve => {
      console.log("setTransactionId CALLED with txId: ", txId);
      const onReply = e => {
        if (!e.isTrusted || e.origin !== coinifyConfig.host || !e.data) return;
        const { type, event, context } = e.data;
        console.log(e.data);

        if (type === "event" && event === "trade.trade-created") {
          resolve(context);
        }
      };
      window.addEventListener("message", onReply, { once: true });
      widgetRef.current.contentWindow.postMessage(
        {
          type: "event",
          event: "settings.partner-context-changed",
          context: {
            partnerContext: {
              nonce: txId,
            },
          },
        },
        coinifyConfig.host,
      );
      widgetRef.current.contentWindow.postMessage(
        {
          type: "event",
          event: "trade.confirm-trade-prepared",
          context: {
            confirmed: true,
          },
        },
        coinifyConfig.host,
      );
    });
  }, []);

  const initSellFlow = useCallback(
    ({ amount, recipient }) => {
      dispatch(
        openModal("MODAL_SELL_CRYPTO_DEVICE", {
          account,
          parentAccount,
          amount,
          recipient,
          onResult: handleOnResult,
          onChangeTransactionId: setTransactionId,
          onCancel: handleOnCancel,
          verifyAddress: true,
        }),
      );
    },
    [account, parentAccount, handleOnResult, handleOnCancel],
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (!account) return;

    function onMessage(e) {
      if (!e.isTrusted || e.origin !== coinifyConfig.host || !e.data) return;
      const { type, event, context } = e.data;
      console.log(e.data);

      if (type !== "event") return;
      switch (event) {
        case "trade.trade-created":
          if (mode === "sell") {
            console.log(e.data);
          }
          break;
        case "trade.trade-prepared":
          if (mode === "sell") {
            initSellFlow({
              amount: parseCurrencyUnit(currency.units[0], "0.001"
              ),
              recipient: context.transferIn.details.refundAccount,
            });
          }
          break;
        case "trade.receive-account-changed":
          if (mainAccount && context.address === mainAccount.freshAddress) {
            dispatch(
              openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
                account,
                parentAccount,
                onResult: handleOnResult,
                onCancel: handleOnCancel,
                verifyAddress: true,
              }),
            );
            if (currency) {
              track("Coinify Confirm Buy Start", { currencyName: currency.name });
            }
          } else {
            // Address mismatch, potential attack
          }
          break;
        case "trade.trade-placed":
          if (currency) {
            track("Coinify Widget Event Trade Placed", { currencyName: currency.name });
          }
          break;
      }
    }

    window.addEventListener("message", onMessage, false);
    return () => window.removeEventListener("message", onMessage, false);
  }, [
    mainAccount,
    url,
    coinifyConfig.host,
    dispatch,
    handleOnCancel,
    handleOnResult,
    account,
    currency,
    parentAccount,
  ]);

  return (
    <WidgetContainer>
      <CustomIframe
        src={url}
        ref={widgetRef}
        style={{ opacity: widgetLoaded ? 1 : 0 }}
        onLoad={() => setTimeout(() => setWidgetLoaded(true), 500)}
        allow="camera"
      />
      {onReset ? (
        <WidgetFooter>
          <IconContainer>
            <Reset size={12} />
          </IconContainer>
          <FakeLink fontSize={3} ff="Inter|SemiBold" onClick={onReset}>
            {t("exchange.reset")}
          </FakeLink>
        </WidgetFooter>
      ) : null}
    </WidgetContainer>
  );
};

export default CoinifyWidget;
