// @flow

import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import { getConfig } from "~/renderer/screens/exchange/config";
import querystring from "querystring";
import FakeLink from "~/renderer/components/FakeLink";
import { useTranslation } from "react-i18next";
import Reset from "~/renderer/icons/Reset";
import type { Account } from "@ledgerhq/live-common/lib/types/account";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";

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
  transferOutMedia?: string,
  transferInMedia?: string,
};

type Props = {
  account?: Account,
  mode: string,
  onReset?: () => void,
};

const CoinifyWidget = ({ account, mode, onReset }: Props) => {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const colors = useTheme("colors");
  const { t } = useTranslation();
  const widgetRef: { current: null | HTMLIFrameElement } = useRef(null);

  const coinifyConfig = getConfig();
  const widgetConfig: CoinifyWidgetConfig = {
    //    fontColor: colors.darkBlue,
    primaryColor: colors.wallet,
    partnerId: coinifyConfig.partnerId,
    cryptoCurrencies: account ? account.currency.ticker : null,
    address: account ? account.freshAddress : null,
    targetPage: mode,
    addressConfirmation: true,
  };

  if (mode === "buy") {
    widgetConfig.transferOutMedia = "blockchain";
  }

  if (mode === "sell") {
    widgetConfig.transferInMedia = "blockchain";
  }

  if (mode === "trade-history") {
    widgetConfig.transferOutMedia = "";
    widgetConfig.transferInMedia = "";
  }

  const url = `${coinifyConfig.url}?${querystring.stringify(widgetConfig)}`;

  const handleOnResult = useCallback(() => {
    if (account && widgetRef.current) {
      widgetRef.current.contentWindow.postMessage(
        {
          type: "event",
          event: "trade.receive-account-confirmed",
          context: {
            address: account.freshAddress,
            status: "accepted",
          },
        },
        coinifyConfig.host,
      );
    }
  }, [coinifyConfig.host, account]);

  const handleOnCancel = useCallback(() => {
    if (account && widgetRef.current) {
      widgetRef.current.contentWindow.postMessage(
        {
          type: "event",
          event: "trade.receive-account-confirmed",
          context: {
            address: account.freshAddress,
            status: "rejected",
          },
        },
        coinifyConfig.host,
      );
    }
  }, [coinifyConfig.host, account]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!account) return;

    function onMessage(e) {
      if (!e.isTrusted || e.origin !== coinifyConfig.host || !e.data) return;
      const { type, event, context } = e.data;
      if (type !== "event") return;
      switch (event) {
        case "trade.receive-account-changed":
          if (context.address === account.freshAddress) {
            dispatch(
              openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
                account,
                onResult: handleOnResult,
                onCancel: handleOnCancel,
                verifyAddress: true,
              }),
            );
          } else {
            // Address mismatch, potential attack
          }
          break;
      }
    }

    window.addEventListener("message", onMessage, false);
    return () => window.removeEventListener("message", onMessage, false);
  }, [account, url, coinifyConfig.host, dispatch, handleOnCancel, handleOnResult]);
  //         sandbox="allow-scripts allow-same-origin allow-forms"
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
