// @flow

import React from "react";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import type { CurrencyType } from "~/renderer/reducers/market";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import CryptocurrencyStar from "~/renderer/components/MarketList/CryptocurrencyStar";

type CryptocurrencyHeaderType = { currency: CurrencyType };

const Title = styled(Text)`
  color: ${p => p.theme.colors.palette.text.shade100};
  font-size: 28px;
  text-transform: uppercase;
`;

const Platform = styled(Text)`
  color: ${p => p.theme.colors.palette.text.shade60};
  font-size: 14px;
  text-transform: uppercase;
`;

function CryptocurrencyHeader({ currency }: CryptocurrencyHeaderType) {
  return (
    <Box py={2}>
      <Box horizontal>
        <Box horizontal pr={3}>
          <CryptoCurrencyIcon currency={currency} size={56} />
        </Box>
        <Box px={16}>
          <Box horizontal alignItems="center">
            <Title>{currency.name}</Title>
            <Box px={2}>
              <CryptocurrencyStar currency={currency} />
            </Box>
          </Box>
          <Platform>{currency.family}</Platform>
        </Box>
      </Box>
    </Box>
  );
}

export default CryptocurrencyHeader;
