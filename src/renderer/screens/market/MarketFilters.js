// @flow
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Switch from "~/renderer/components/Switch";
import Button from "~/renderer/components/Button";
import Ellipsis from "~/renderer/components/Ellipsis";
import { closePlatformAppDrawer } from "~/renderer/actions/UI";
import { getMarketCryptoCurrencies, setMarketFilters } from "~/renderer/actions/market";

type LedgerLiveCompatibleProps = {
  value: boolean,
  onValueChange: (value: boolean) => void,
};
type MarketFiltersFooterProps = {
  onClearAll: () => void,
  onApply: () => void,
};

const Divider = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

const BasicButton = styled(Button)`
  padding: 15px 24px;
  border-radius: 48px;
  color: #6490f1;
`;

const PrimaryButton = styled(Button)`
  padding: 15px 24px;
  background: ${p => p.theme.colors.palette.text.shade100};
  color: ${p => p.theme.colors.palette.background.paper};

  &:hover {
    background: ${p =>
      p.theme.colors.palette.type === "dark" ? p.theme.colors.palette.text.shade100 : "#6490f1"};
    color: ${p => p.theme.colors.palette.background.paper};
  }
`;

const MainWrapper = styled(Box)``;

const SectionWrapper = styled.div`
  margin-bottom: 40px;

  &.platform {
    .scrollable-block {
      max-height: 160px;
      overflow-y: auto;

      ::-webkit-scrollbar {
        width: 3px;
      }

      ::-webkit-scrollbar-thumb {
        background: ${p => p.theme.colors.palette.text.shade20};
      }
    }
  }
`;

const SectionTitle = styled.div`
  background: ${p => p.theme.colors.palette.text.shade5};
  border-radius: 4px;
  font-size: 12px;
  padding: 8px 16px;
  font-weight: 600;
  text-transform: uppercase;
`;

const FooterWrapper = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const LedgerLiveCompatible = ({ value, onValueChange }: LedgerLiveCompatibleProps) => {
  return (
    <SectionWrapper>
      <SectionTitle>Ledger Live Compatible</SectionTitle>
      <Box px={3} pt={5} horizontal alignItems="center" justifyContent="space-between">
        <Label color="palette.text.shade50" fontSize={12}>
          Display only the assets you can have an account in Ledger Live
        </Label>
        <Switch isChecked={value} onChange={() => onValueChange(!value)} />
      </Box>
    </SectionWrapper>
  );
};

const MarketFiltersFooter = ({ onApply, onClearAll }: MarketFiltersFooterProps) => {
  return (
    <FooterWrapper>
      <Divider />
      <Box px={5} py={4} horizontal justifyContent="space-between">
        <BasicButton onClick={() => onClearAll()}>
          <Ellipsis>Clear all</Ellipsis>
        </BasicButton>
        <PrimaryButton onClick={() => onApply()}>
          <Ellipsis>Apply filters</Ellipsis>
        </PrimaryButton>
      </Box>
    </FooterWrapper>
  );
};

function MarketFilters() {
  const savedFilters = useSelector(state => state.market.filters);
  const dispatch = useDispatch();
  const [isLedgerCompatible, setIsLedgerCompatible] = useState(savedFilters.isLedgerCompatible);

  const onClearAll = () => {
    setIsLedgerCompatible(false);
  };

  const onApplyFilters = useCallback(() => {
    dispatch(setMarketFilters({ isLedgerCompatible }));
    dispatch(getMarketCryptoCurrencies());
    dispatch(closePlatformAppDrawer());
  }, [dispatch, isLedgerCompatible]);

  return (
    <Box>
      <MainWrapper pt={6} px={5}>
        <LedgerLiveCompatible
          value={isLedgerCompatible}
          onValueChange={value => setIsLedgerCompatible(value)}
        />
      </MainWrapper>
      <MarketFiltersFooter onClearAll={() => onClearAll()} onApply={() => onApplyFilters()} />
    </Box>
  );
}

export default MarketFilters;
