// @flow

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import { getConfig } from "~/renderer/screens/exchange/config";
import querystring from "querystring";
import FakeLink from "~/renderer/components/FakeLink";
import { useTranslation } from "react-i18next";
import Reset from "~/renderer/icons/Reset";
import type { Account } from "@ledgerhq/live-common/lib/types/account";
import DeviceVerify from "~/renderer/screens/exchange/DeviceVerify";

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const IconContainer = styled.div`
  margin-right: 4px;
`;

const CustomIframe = styled.iframe`
  border: none;
  width: 100%;
  flex: 1;
  transition: opacity 200ms ease-out;
`;

const WidgetFooter = styled.div`
  height: 45px;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${p => p.theme.colors.palette.primary.main};
`;

type Props = {
  account?: Account,
  mode: string,
  onReset?: () => void,
};

const CoinifyWidget = ({ account, mode, onReset }: Props) => {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [isAwaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const colors = useTheme("colors");
  const { t } = useTranslation();
  const widgetRef = useRef(null);

  const coinifyConfig = getConfig("developpement");
  const widgetConfig = {
    //    fontColor: colors.darkBlue,
    primaryColor: colors.wallet,
    partnerId: coinifyConfig.partnerId,
    cryptoCurrencies: account ? account.currency.ticker : null,
    address: account ? account.freshAddress: null,
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

  useEffect(() => {
    if (!account) return;

    function onMessage(e) {
      if (!e.isTrusted || e.origin !== coinifyConfig.host || !e.data) return;
      const { type, event, context } = e.data;
      if (type !== "event") return;
      switch (event) {
        case "trade.receive-account-changed":
          if (context.address === account.freshAddress) {
            setAwaitingConfirmation(true);
          } else {
            // Address mismatch, potential attack
          }
          break;
      }
    }

    window.addEventListener("message", onMessage, false);
    return () => window.removeEventListener("message", onMessage, false);
  }, [account, url]);
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
      {isAwaitingConfirmation && account ? (
        <DeviceVerify
          account={account}
          onResult={() => {
            setAwaitingConfirmation(false);
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
          }}
          onCancel={() => {
            setAwaitingConfirmation(false);
            widgetRef.current.contentWindow.postMessage({
              type: "event",
              event: "trade.receive-account-confirmed",
              context: {
                address: account.freshAddress,
                status: "rejected",
              },
            });
          }}
        />
      ) : null}
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
