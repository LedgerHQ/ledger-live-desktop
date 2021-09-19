// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import { MarketCounterValueSelect } from "~/renderer/screens/market/MarketCounterValueSelect";
import { MarketRangeSelect } from "~/renderer/screens/market/MarketRangeSelect";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const RightBox: ThemedComponent<{}> = styled(Box)`
  & button {
    color: ${p => p.theme.colors.marketDown_eastern};
  }

  & button:hover {
    text-decoration: none !important;
  }
`;

const MarketHeader = () => {
  const { t } = useTranslation();

  return (
    <Box horizontal style={{ paddingBottom: 32 }}>
      <Box grow ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="accounts-title">
        {"Market"}
      </Box>
      <RightBox horizontal flow={2} alignItems="center" justifyContent="flex-end">
        {/* <MarketCounterValueSelect /> */}
        <MarketRangeSelect />
      </RightBox>
    </Box>
  );
};

export default React.memo<{}>(MarketHeader);
