// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import SelectProvider from "~/renderer/screens/exchange/Buy/SelectProvider";
import Box from "~/renderer/components/Box";
import { CoinifySquare, MoonPay } from "~/renderer/icons/providers";
import Button from "~/renderer/components/Button";
import Coinify from "~/renderer/screens/exchange/Buy/Coinify";
import type { DProps } from "~/renderer/screens/exchange";

const BuyContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding-top: ${p => (p.isCoinify ? "" : "72px")};
`;

const Footer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  width: 100%;
  padding: 20px 24px;

  & > :only-child {
    margin-left: auto;
  }
`;

const ProvidersRow: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  p: "0 40.5px",
  width: "100%",
  my: 48,
}))`
  column-gap: 24px;
`;

const ContinueButton: ThemedComponent<{}> = styled(Button).attrs(() => ({}))`
  padding: 12px 16px;
`;

type Provider = "moonpay" | "coinify" | null;

const Buy = ({ defaultCurrency, defaultAccount }: DProps) => {
  const [selected, setSelected] = useState<Provider>(null);
  const [isCoinify, setIsCoinify] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();

  const toggle = useCallback((provider: Provider) => {
    setSelected(prev => (prev === provider ? null : provider));
  }, []);

  const onContinue = useCallback(() => {
    if (selected === "moonpay") {
      history.push("/platform/moonpay");

      return;
    }

    setIsCoinify(true);
  }, [selected, history]);

  return (
    <BuyContainer isCoinify={isCoinify}>
      <TrackPage category="Buy Crypto" />
      {isCoinify ? (
        <Coinify defaultCurrency={defaultCurrency} defaultAccount={defaultAccount} />
      ) : (
        <>
          <Text ff="Inter|SemiBold" fontSize={18} color="palette.text.shade90">
            {t("exchange.buy.title")}
          </Text>
          <ProvidersRow>
            <SelectProvider
              provider="MoonPay"
              cryptoCount={40}
              onClick={() => toggle("moonpay")}
              isActive={selected === "moonpay"}
            >
              <MoonPay size={48} />
            </SelectProvider>
            <SelectProvider
              provider="Coinify"
              cryptoCount={10}
              onClick={() => toggle("coinify")}
              isActive={selected === "coinify"}
            >
              <CoinifySquare size={48} />
            </SelectProvider>
          </ProvidersRow>
          <Footer>
            <ContinueButton primary disabled={!selected} onClick={onContinue}>
              {t("common.continue")}
            </ContinueButton>
          </Footer>
        </>
      )}
    </BuyContainer>
  );
};

export default Buy;
