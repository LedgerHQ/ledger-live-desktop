// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import SelectProvider from "~/renderer/screens/exchange/Buy/SelectProvider";
import Box from "~/renderer/components/Box";
import { CoinifySquare, MoonPay } from "~/renderer/icons/providers";
import Button from "~/renderer/components/Button";
import Coinify from "~/renderer/screens/exchange/Buy/Coinify";

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

const ContinueButton: ThemedComponent<{}> = styled(Button).attrs(() => ({}))`
  padding: 12px 16px;
`;

type Providers = "moonpay" | "coinify" | null;

const Buy = () => {
  const [selected, setSelected] = useState<Providers>(null);
  const [isCoinify, setIsCoinify] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();

  const toggleMoonPay = useCallback(() => {
    setSelected(prev => (prev === "moonpay" ? null : "moonpay"));
  }, []);

  const toggleCoinify = useCallback(() => {
    setSelected(prev => (prev === "coinify" ? null : "coinify"));
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
        <Coinify />
      ) : (
        <>
          <Text ff="Inter|SemiBold" fontSize={18} color="palette.text.shade90">
            {t("exchange.buy.title")}
          </Text>
          <Box horizontal width="100%" p="0 40.5px" my={48}>
            <SelectProvider
              provider="MoonPay"
              cryptoCount={40}
              onClick={toggleMoonPay}
              isActive={selected === "moonpay"}
            >
              <MoonPay size={48} />
            </SelectProvider>
            <SelectProvider
              provider="Coinify"
              cryptoCount={10}
              onClick={toggleCoinify}
              isActive={selected === "coinify"}
            >
              <CoinifySquare size={48} />
            </SelectProvider>
          </Box>
          <Footer>
            <ContinueButton primary disabled={!selected} onClick={onContinue}>
              <Trans i18nKey="common.continue" />
            </ContinueButton>
          </Footer>
        </>
      )}
    </BuyContainer>
  );
};

export default Buy;
