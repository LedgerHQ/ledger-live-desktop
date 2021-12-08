// @flow
import React from "react";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import LoadingPlaceholder from "~/renderer/components/LoadingPlaceholder";

const CryptoCurrencyIconWrapper: ThemedComponent<{}> = styled("div")`
  height: 56px;
  width: 56px;
  position: relative;

  img {
    height: 100%;
  }
`;

type CryptocurrencyHeaderType = { currency: MarketCurrencyInfo, loading: boolean };

const Title: ThemedComponent<{}> = styled(Text)`
  color: ${p => p.theme.colors.palette.text.shade100};
  font-size: 28px;
  line-height: 34px;
  text-transform: uppercase;
  font-weight: 600;
  margin-right: 8px;
`;

const Symbol: ThemedComponent<{}> = styled(Text)`
  color: ${p => p.theme.colors.palette.text.shade30};
  font-size: 22px;
  line-height: 140%;
  text-transform: uppercase;
  font-weight: 500;
`;

function CryptocurrencyHeader({ currency, loading }: CryptocurrencyHeaderType) {
  return (
    <Box py={2}>
      <Box horizontal alignItems="center">
        <Box horizontal>
          <CryptoCurrencyIconWrapper>
            {loading ? <LoadingPlaceholder /> : <img src={currency.image} alt={"Currency logo"} />}
          </CryptoCurrencyIconWrapper>
        </Box>
        <Box ml={12}>
          <Box horizontal alignItems="flex-end">
            <Title>
              {loading ? (
                <LoadingPlaceholder style={{ height: "34px", width: "115px" }} />
              ) : (
                currency.name
              )}
            </Title>
            <Symbol>
              {loading ? (
                <LoadingPlaceholder style={{ height: "30px", width: "115px" }} />
              ) : (
                currency.symbol
              )}
            </Symbol>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CryptocurrencyHeader;
