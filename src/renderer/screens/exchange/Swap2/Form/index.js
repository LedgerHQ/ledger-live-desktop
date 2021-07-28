// @flow
import React, { useState, useEffect } from "react";
import SwapFormSummary from "./FormSummary";
import SwapFormSelectors from "./FormSelectors";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import ButtonBase from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useTranslation } from "react-i18next";
import { useSwapProviders } from "~/renderer/screens/exchange/Swap2/utils/shared/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProvidersAction,
  resetSwapAction,
  currentProviderSelector,
  providersSelector,
} from "~/renderer/actions/swap";
import FormLoading from "./FormLoading";

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
  const { providers, error } = useSwapProviders();
  const dispatch = useDispatch();

  const currentProvider = useSelector(currentProviderSelector);
  const storedProviders = useSelector(providersSelector);

  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  const onSubmit = () => {};

  useEffect(() => {
    if (providers) dispatch(updateProvidersAction(providers));
  }, [providers]);

  useEffect(() => {
    if (error) dispatch(resetSwapAction());
  }, [error]);

  if (currentProvider)
    return (
      <Wrapper>
        <SwapFormSelectors />
        <SwapFormSummary {...summaryMockedData} />
        <Button primary disabled={!isSwapReady} onClick={onSubmit}>
          {t("common.exchange")}
        </Button>
      </Wrapper>
    );

  if (error) return <p>not available</p>;
  if (storedProviders?.length === 0) return <p>not available</p>;

  return <FormLoading />;
};

export default SwapForm;
