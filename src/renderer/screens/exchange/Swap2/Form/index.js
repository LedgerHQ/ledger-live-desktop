// @flow
import React, { useState } from "react";
import SwapFormSummary from "./FormSummary";
import SwapFormSelectors from "./FormSelectors";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import ButtonBase from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useTranslation } from "react-i18next";

// SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
const summaryMockedData = {
  fees: "0.000034 ETH",
  rate: "1 ETH = 0,06265846 BTC",
  provider: "Changelly",
  onProviderChange: () => {},
  onFeesChange: () => {},
  onTargetChange: () => {},
};

const Wrapper: ThemedComponent<{}> = styled(Box).attrs({
  pt: 36,
  pb: 20,
})`
  row-gap: 1.75rem;
  max-width: 27.5rem;
`;

const Button = styled(ButtonBase)`
  justify-content: center;
`;

const SwapForm = () => {
  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  const [isSwapReady] = useState(false);
  const { t } = useTranslation();

  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  const onSubmit = () => {};

  return (
    <Wrapper>
      <SwapFormSelectors />
      <SwapFormSummary {...summaryMockedData} />
      <Button primary disabled={!isSwapReady} onClick={onSubmit}>
        {t("common.exchange")}
      </Button>
    </Wrapper>
  );
};

export default SwapForm;
