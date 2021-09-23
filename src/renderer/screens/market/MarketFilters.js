import React, { useState } from "react";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import Label from "~/renderer/components/Label";
import Switch from "~/renderer/components/Switch";
import Checkbox from "~/renderer/components/CheckBox";
import { TextLink } from "~/renderer/components/Breadcrumb/common";
import Button from "~/renderer/components/Button";
import Ellipsis from "~/renderer/components/Ellipsis";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";

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
  border-radius: 48px;
  background: ${p => p.theme.colors.palette.type === "dark" ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.primary.main};
  color: ${p => p.theme.colors.palette.background.paper};

  &:hover {
    background: ${p => p.theme.colors.palette.type === "dark" ? p.theme.colors.palette.text.shade100 : "#6490f1"};
    color: ${p => p.theme.colors.palette.background.paper};
  }
`;

const MainWrapper = styled(Box)`

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

      // ::-webkit-scrollbar-track {
        //   background: ${p => p.theme.colors.palette.text.shade5};
      // }
      //
      ///* Handle */
      //
      ::-webkit-scrollbar-thumb {
        background: ${p => p.theme.colors.palette.text.shade20};
      }

      //
      ///* Handle on hover */
      //
      //::-webkit-scrollbar-thumb:hover {
      //  background: #555;
      //}
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

function TypeFilter(props) {
  const indicators = [
    {
      label: "All cryptocurrencies",
      key: "all"
    },
    {
      label: "Coins",
      key: "coins"
    },
    {
      label: "Tokens",
      key: "tokens"
    }
  ];
  return (
    <SectionWrapper>
      <SectionTitle>Type</SectionTitle>
      <Box pt={5}>
        <Box px={3} pb={2} horizontal alignItems="center">
          <Checkbox isRadio={true} />
          <Box px={3} horizontal alignItems="center">
            <Label px={3} color="palette.text.shade50" fontSize={12}>
              {/*<Trans i18nKey="bitcoin.pickUnconfirmedRBF" />*/}
              All cryptocurrencies
            </Label>
          </Box>
        </Box>
        <Box px={3} pb={2} horizontal alignItems="center">
          <Checkbox isChecked isRadio />
          <Box px={3} horizontal alignItems="center">
            <Label px={3} color="palette.text.shade50" fontSize={12}>
              {/*<Trans i18nKey="bitcoin.pickUnconfirmedRBF" />*/}
              Coins
            </Label>
          </Box>
        </Box>
        <Box px={3} pb={2} horizontal alignItems="center">
          <Checkbox isChecked isRadio />
          <Box px={3} horizontal alignItems="center">
            <Label px={3} color="palette.text.shade50" fontSize={12}>
              {/*<Trans i18nKey="bitcoin.pickUnconfirmedRBF" />*/}
              Tokens
            </Label>
          </Box>
        </Box>
      </Box>
    </SectionWrapper>
  );
}

function PlatformFilter(props) {
  const [showMore, setShowMore] = useState(false);
  const supportedCurrencies = listSupportedCurrencies();
  let familiies = [];
  supportedCurrencies.forEach(currency => {
    currency.family = currency.family.charAt(0).toUpperCase() + currency.family.slice(1);
    if (familiies.indexOf(currency.family) < 0) {
      familiies.push(currency.family);
    }
  });

  return (
    <SectionWrapper className="platform">
      <SectionTitle>Platform</SectionTitle>
      <Box className="scrollable-block" mt={5}>
        {familiies.slice(0, 3).map(family => (
          <Box key={family} px={3} pb={2} horizontal alignItems="center">
            <Checkbox isChecked />
            <Box px={3} horizontal alignItems="center">
              <Label px={3} color="palette.text.shade50" fontSize={12}>
                {/*<Trans i18nKey="bitcoin.pickUnconfirmedRBF" />*/}
                {family}
              </Label>
            </Box>
          </Box>
        ))}
        {showMore && familiies.slice(3).map(family => (
          <Box key={family} px={3} pb={2} horizontal alignItems="center">
            <Checkbox isChecked />
            <Box px={3} horizontal alignItems="center">
              <Label px={3} color="palette.text.shade50" fontSize={12}>
                {/*<Trans i18nKey="bitcoin.pickUnconfirmedRBF" />*/}
                {family}
              </Label>
            </Box>
          </Box>
        ))}
      </Box>
      <Box px={3} horizontal>
        <TextLink shrink>
          <BasicButton onClick={() => setShowMore(!showMore)}>
            <Ellipsis>{showMore ? "Show less" : "Show more"}</Ellipsis>
          </BasicButton>
          {/*<AngleDown>*/}
          {/*  {showMore ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}*/}
          {/*</AngleDown>*/}
        </TextLink>
      </Box>
    </SectionWrapper>
  );
}

function LedgerLiveCompatible(props) {
  const [checked, setChecked] = useState(false);
  return (
    <SectionWrapper>
      <SectionTitle>Ledger Live Compatible</SectionTitle>
      <Box px={3} pt={5} horizontal alignItems="center" justifyContent="space-between">
        <Label color="palette.text.shade50" fontSize={12}>
          {/*<Trans i18nKey="bitcoin.pickUnconfirmedRBF" />*/}
          Display only the assets you can have an account in Ledger Live
        </Label>
        <Switch
          isChecked={checked}
          onChange={setChecked}
        />
      </Box>
    </SectionWrapper>
  );
}

function MarketFiltersFooter(props) {
  return (
    <FooterWrapper>
      <Divider />
      <Box px={5} py={4} horizontal justifyContent="space-between">
        <BasicButton>
          <Ellipsis>Clear all</Ellipsis>
        </BasicButton>
        <PrimaryButton>
          <Ellipsis>Apply filters</Ellipsis>
        </PrimaryButton>
      </Box>
    </FooterWrapper>
  );
}

function MarketFilters(props) {
  return (
    <Box>
      <MainWrapper pt={6} px={5}>
        <TypeFilter />
        <PlatformFilter />
        <LedgerLiveCompatible />
        {/*<Text ff="Inter" color="#6490F1">*/}
        {/*  Hello*/}
        {/*</Text>*/}
      </MainWrapper>
      <MarketFiltersFooter />
    </Box>
  );
}

export default MarketFilters;
