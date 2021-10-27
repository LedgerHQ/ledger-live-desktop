// @flow
import React from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { Separator, TextLink } from "./common";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";
import { useSelector } from "react-redux";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";

const CryptoCurrencyIconWrapper: ThemedComponent<{}> = styled("div")`
  height: 10px;
  width: 10px;
  position: relative;
  margin-right: 10px;
  img {
    height: 100%;
  }
`;

const CryptocurrencyCrumb = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const currency = ((useLocation().state: any): MarketCurrencyInfo);
  const { currencies } = useSelector(state => state.market);

  return (
    <>
      <TextLink>
        <Button
          onClick={() => {
            setTrackingSource("market breadcrumb");
            history.push({
              pathname: "/market/",
            });
          }}
        >
          {t("market.title")}
        </Button>
      </TextLink>
      <Separator />
      <Box horizontal>
        <CryptoCurrencyIconWrapper>
          <img src={currencies.find(item => item.id === currency.id).image} />
        </CryptoCurrencyIconWrapper>
        {currency.name}
      </Box>
    </>
  );
};

export default CryptocurrencyCrumb;
