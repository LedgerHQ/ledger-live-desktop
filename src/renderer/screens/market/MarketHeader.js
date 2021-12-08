// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import IconFilters from "~/renderer/icons/Filters";
import { MarketCounterValueSelect } from "~/renderer/components/MarketList/MarketCounterValueSelect";
import { MarketRangeSelect } from "~/renderer/components/MarketList/MarketRangeSelect";
import { ItemContainer } from "~/renderer/components/TopBar/shared";
import { openMarketFilterDrawer } from "~/renderer/actions/UI";
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

  const dispatch = useDispatch();

  const onFilterClick = useCallback(() => {
    dispatch(openMarketFilterDrawer());
  });

  return (
    <Box horizontal style={{ paddingBottom: 32 }}>
      <Box grow ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="accounts-title">
        {t("market.title")}
      </Box>
      <RightBox horizontal flow={2} alignItems="center" justifyContent="flex-end">
        <MarketCounterValueSelect />
        <MarketRangeSelect />
        <ItemContainer
          id="market-filter-button"
          isInteractive
          onClick={onFilterClick}
          style={{ cursor: "pointer" }}
        >
          <IconFilters size={16} />
        </ItemContainer>
      </RightBox>
    </Box>
  );
};

export default React.memo<{}>(MarketHeader);
