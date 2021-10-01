// @flow
import React, { useCallback, useState } from "react";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import Label from "~/renderer/components/Label";
import Switch from "~/renderer/components/Switch";
import Checkbox from "~/renderer/components/CheckBox";
import { TextLink } from "~/renderer/components/Breadcrumb/common";
import Button from "~/renderer/components/Button";
import Ellipsis from "~/renderer/components/Ellipsis";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { useDispatch, useSelector } from "react-redux";
import { closePlatformAppDrawer } from "~/renderer/actions/UI";
import type { CurrencyType } from "~/renderer/reducers/market";
import { setMarketFilters } from "~/renderer/actions/market";

type TypeFilterRow = { key: CurrencyType, label: string };
type PlatformFilterProps = {
  displayedFamilies: string[],
  selectedPlatforms: string[],
  isShowMoreActive: boolean,
  onShowMore: () => void,
  setSelectedPlatforms: (platforms: string[]) => void,
};
type TypeFilterProps = {
  selectedCurrencyType: TypeFilterRow,
  onSelectType: (typeFilter: TypeFilterRow) => void,
};
type LedgerLiveCompatibleProps = {
  value: boolean,
  onValueChange: (value: boolean) => void,
};
type MarketFiltersFooterProps = {
  onClearAll: () => void,
  onApply: () => void,
};

const currenciesTypes: TypeFilterRow[] = [
  {
    key: "all",
    label: "All cryptocurrencies",
  },
  {
    key: "coins",
    label: "Coins",
  },
  {
    key: "tokens",
    label: "Tokens",
  },
];

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

const TypeFilter = ({ selectedCurrencyType, onSelectType }: TypeFilterProps) => {
  return (
    <SectionWrapper>
      <SectionTitle>Type</SectionTitle>
      <Box pt={5}>
        {currenciesTypes.map(currency => (
          <Box key={currency.key} px={3} pb={2} horizontal alignItems="center">
            <Checkbox
              isRadio={true}
              isChecked={selectedCurrencyType.key === currency.key}
              onChange={() => onSelectType(currency)}
            />
            <Box px={3} horizontal alignItems="center">
              <Label px={3} color="palette.text.shade50" fontSize={12}>
                {currency.label}
              </Label>
            </Box>
          </Box>
        ))}
      </Box>
    </SectionWrapper>
  );
};

const PlatformFilter = ({
  displayedFamilies,
  selectedPlatforms,
  onShowMore,
  isShowMoreActive,
  setSelectedPlatforms,
}: PlatformFilterProps) => {
  const onPlatformCheck = (family: string) => {
    const isIncluded = selectedPlatforms.includes(family);
    const updatedPlatforms = isIncluded
      ? selectedPlatforms.filter(selectedFamily => selectedFamily !== family)
      : [...selectedPlatforms, family];
    setSelectedPlatforms(updatedPlatforms);
  };

  return (
    <SectionWrapper className="platform">
      <SectionTitle>Platform</SectionTitle>
      <Box className="scrollable-block" mt={5}>
        {displayedFamilies.map(family => {
          return (
            <Box key={family} px={3} pb={2} horizontal alignItems="center">
              <Checkbox
                isChecked={selectedPlatforms.includes(family)}
                onChange={() => onPlatformCheck(family.toLowerCase())}
              />
              <Box px={3} horizontal alignItems="center">
                <Label px={3} color="palette.text.shade50" fontSize={12}>
                  {family.charAt(0).toUpperCase() + family.slice(1)}
                </Label>
              </Box>
            </Box>
          );
        })}
      </Box>
      {isShowMoreActive && (
        <Box px={3} horizontal>
          <TextLink shrink>
            <BasicButton onClick={() => onShowMore()}>
              <Ellipsis>Show more</Ellipsis>
            </BasicButton>
          </TextLink>
        </Box>
      )}
    </SectionWrapper>
  );
};

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
  const FAMILIES_COUNT_STEP = 3; // default and how much families added by clicking "show more"

  const savedFilters = useSelector(state => state.market.filters);
  const dispatch = useDispatch();
  const [displayedFamiliesCount, setDisplayedFamiliesCount] = useState<number>(FAMILIES_COUNT_STEP);
  const [currencyType, setCurrencyType] = useState<TypeFilterRow>(
    currenciesTypes.find(c => c.key === savedFilters.currencyType),
  );
  const [isLedgerCompatible, setIsLedgerCompatible] = useState(savedFilters.isLedgerCompatible);

  const supportedCurrencies = listCryptoCurrencies();
  const families = [];
  supportedCurrencies.forEach(currency => {
    if (families.indexOf(currency.family) < 0) {
      families.push(currency.family);
    }
  });

  const displayedFamilies = families.slice(0, displayedFamiliesCount);

  const [selectedPlatforms, setSelectedPlatforms] = useState(savedFilters.selectedPlatforms);

  const isShowMoreActive: boolean =
    families.length > FAMILIES_COUNT_STEP && displayedFamilies.length < families.length;

  const onShowMore = () => {
    setDisplayedFamiliesCount(displayedFamiliesCount + FAMILIES_COUNT_STEP);
  };

  const onClearAll = () => {
    setCurrencyType(currenciesTypes.find(c => c.key === "all"));
    setSelectedPlatforms([]);
    setIsLedgerCompatible(false);
  };

  const onApplyFilters = useCallback(() => {
    dispatch(
      setMarketFilters({ currencyType: currencyType.key, selectedPlatforms, isLedgerCompatible }),
    );
    dispatch(closePlatformAppDrawer());
  }, [currencyType, dispatch, isLedgerCompatible, selectedPlatforms]);

  return (
    <Box>
      <MainWrapper pt={6} px={5}>
        <TypeFilter
          selectedCurrencyType={currencyType}
          onSelectType={type => setCurrencyType(type)}
        />
        <PlatformFilter
          displayedFamilies={displayedFamilies}
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={platforms => setSelectedPlatforms(platforms)}
          onShowMore={() => onShowMore()}
          isShowMoreActive={isShowMoreActive}
        />
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
