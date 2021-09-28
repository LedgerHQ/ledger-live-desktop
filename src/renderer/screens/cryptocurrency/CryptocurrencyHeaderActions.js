import React from "react";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { MarketCounterValueSelect } from "~/renderer/screens/market/MarketCounterValueSelect";

function CryptocurrencyHeaderActions(props) {
  return (
    <Box horizontal alignItems="center">
      <Box mr={12}>
        <MarketCounterValueSelect />
      </Box>
      <Box mr={12}>
        <Button primary>Buy</Button>
      </Box>
      <Box mr={12}>
        <Button primary>Swap</Button>
      </Box>
    </Box>
  );
}

export default CryptocurrencyHeaderActions;
