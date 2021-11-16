// @flow
import React, { useCallback, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Button from "~/renderer/components/Button";
import Ellipsis from "~/renderer/components/Ellipsis";
import { closePlatformAppDrawer } from "~/renderer/actions/UI";
import CheckBox from "~/renderer/components/CheckBox";
import { useTranslation } from "react-i18next";
import { MarketContext } from "~/renderer/contexts/MarketContext";
import { GET_MARKET_CRYPTO_CURRENCIES } from "~/renderer/contexts/actionTypes";

type ShowProps = {
  value: string,
  onValueChange: (value: string) => void,
};
type MarketFiltersFooterProps = {
  onClearAll: () => void,
  onApply: () => void,
};

const Divider = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
`;

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

const Show = ({ value, onValueChange }: ShowProps) => {
  const { t } = useTranslation();

  const options = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Ledger Live Compatible",
      value: "isLedgerCompatible",
    },
    {
      label: "Starred Assets",
      value: "isFavorite",
    },
  ];

  return (
    <SectionWrapper>
      <SectionTitle>Show</SectionTitle>
      {options.map(option => (
        <Box key={option.value} px={3} pt={5} horizontal alignItems="center">
          <CheckBox
            isChecked={value === option.value}
            isRadio
            onChange={() => onValueChange(option.value)}
          />
          <Label ml={14} color="palette.text.shade50" fontSize={12}>
            {t(`market.filters.${option.value}`)}
          </Label>
        </Box>
      ))}
    </SectionWrapper>
  );
};

const MarketFiltersFooter = ({ onApply, onClearAll }: MarketFiltersFooterProps) => {
  const { t } = useTranslation();
  return (
    <FooterWrapper>
      <Divider />
      <Box px={5} py={4} horizontal justifyContent="space-between">
        <Button onClick={() => onClearAll()}>
          <Ellipsis>{t(`market.filters.clearAll`)}</Ellipsis>
        </Button>
        <Button primary onClick={() => onApply()}>
          <Ellipsis>{t(`market.filters.applyFilters`)}</Ellipsis>
        </Button>
      </Box>
    </FooterWrapper>
  );
};

function MarketFilters() {
  const dispatch = useDispatch();
  const { contextState, contextDispatch } = useContext(MarketContext);
  // const savedFilters = useSelector(state => state.market.filters);
  const savedFilters = contextState.filters;
  const [isLedgerCompatible, setIsLedgerCompatible] = useState(savedFilters.isLedgerCompatible);
  const [isFavorite, setIsFavorites] = useState(savedFilters.isFavorite);

  const onClearAll = () => {
    setIsLedgerCompatible(false);
  };

  const currentValue = isFavorite
    ? "isFavorite"
    : isLedgerCompatible
    ? "isLedgerCompatible"
    : "all";

  const onChange = value => {
    switch (value) {
      case "isFavorite":
        setIsFavorites(true);
        setIsLedgerCompatible(false);
        break;
      case "isLedgerCompatible":
        setIsLedgerCompatible(true);
        setIsFavorites(false);
        break;
      default:
        setIsFavorites(false);
        setIsLedgerCompatible(false);
        break;
    }
  };

  const onApplyFilters = useCallback(() => {
    contextDispatch(GET_MARKET_CRYPTO_CURRENCIES, { filters: { isLedgerCompatible, isFavorite } });
    dispatch(closePlatformAppDrawer());
  }, [contextDispatch, dispatch, isFavorite, isLedgerCompatible]);

  return (
    <Box>
      <Box pt={6} px={5}>
        <Show value={currentValue} onValueChange={value => onChange(value)} />
      </Box>
      <MarketFiltersFooter onClearAll={() => onClearAll()} onApply={() => onApplyFilters()} />
    </Box>
  );
}

export default MarketFilters;
