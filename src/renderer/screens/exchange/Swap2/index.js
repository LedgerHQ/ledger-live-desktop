// @flow
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { SwapFormSummary } from "./Form";
import FormInputs from "./Form/FormInputs";
import { FORM_CONTAINER_WIDTH } from "./Form/utils";
import styled from "styled-components";
import ButtonBase from "~/renderer/components/Button";

// SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
const mockData = {
  fees: "0.000034 ETH",
  rate: "1 ETH = 0,06265846 BTC",
  provider: "Changelly",
  onProviderChange: () => {},
  onFeesChange: () => {},
  onTargetChange: () => {},
};

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 27.5rem 1fr;
  row-gap: 1.5rem;

  padding: 2rem 0;
  background-color: ${p => p.theme.colors.palette.background.paper};
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;

  & > * {
    // Automatically move every children in the middle column
    grid-column-start: 2;
    grid-column-end: 3;
  }
`;

const Header = styled.div`
  padding: 0 2rem;
`;

const Subtitle = styled(Text).attrs({
  textAlign: "center",
  ff: "Inter",
  fontSize: "0.8125rem",
  lineHeight: "1.4",
})`
  display: inline-block;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

const Body = styled(Box).attrs({
  p: 20,
  borderRadius: 8,
  boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.04)",
})`
  row-gap: 1.75rem;
  border: 1px solid ${p => p.theme.colors.palette.action.active};
`;

const Button = styled(ButtonBase)`
  justify-content: center;
`;

const Swap2 = () => {
  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  const [isCTADisabled] = useState(false);
  const { t } = useTranslation();

  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  const onSubmit = () => {};

  return (
    <>
      <TrackPage category="Swap" />
      <Text horizontal mb={20} ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100">
        {t("swap.title")}
      </Text>
      <Main>
        <Header>
          <Subtitle>{t("swap2.subtitle")}</Subtitle>
        </Header>
        <Body>
          <Box mb={6}>
            <FormInputs />
          </Box>
          <SwapFormSummary {...mockData} />
          <Button primary disabled={isCTADisabled} onClick={onSubmit}>
            {t("common.exchange")}
          </Button>
        </Body>
      </Main>
    </>
  );
};

export default Swap2;
