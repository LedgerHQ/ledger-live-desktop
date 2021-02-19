// @flow
import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { CurrencyCircleIcon } from "~/renderer/components/CurrencyBadge";
import { useRefreshAccountsOrderingEffect } from "~/renderer/actions/general";
import type { StepProps } from "..";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import {
  useOnClearContextualOverlayQueue,
  useActiveFlow,
} from "~/renderer/components/ProductTour/hooks";

export default function StepFinish({ currency, checkedAccountsIds }: StepProps) {
  const { t } = useTranslation();
  useRefreshAccountsOrderingEffect({ onMount: true, onUnmount: true });

  const currencyName = currency
    ? currency.type === "TokenCurrency"
      ? currency.parentCurrency.name
      : currency.name
    : undefined;

  return (
    <Box alignItems="center" py={6}>
      {/* onMount because if we already have the countervalues we want to sort it straightaway
          onUnmount because if not, it is useful to trigger a second refresh to ensure it get sorted */}

      <TrackPage category="AddAccounts" name="Step4" currencyName={currencyName} />
      {currency ? <CurrencyCircleIcon currency={currency} size={50} showCheckmark /> : null}
      <Title>{t("addAccounts.success", { count: checkedAccountsIds.length })}</Title>
      <Text>{t("addAccounts.successDescription", { count: checkedAccountsIds.length })}</Text>
    </Box>
  );
}

export function StepFinishFooter({ currency, onGoStep1, onCloseModal }: StepProps) {
  const { t } = useTranslation();

  const { send } = useContext(ProductTourContext);
  const activeFlow = useActiveFlow();

  const currencyName = currency
    ? currency.type === "TokenCurrency"
      ? currency.parentCurrency.name
      : currency.name
    : undefined;

  const onClearContextualOverlayQueue = useOnClearContextualOverlayQueue();

  useEffect(() => {
    // NB Hijack the rendering of this step if needed for the product tour
    if (activeFlow) {
      send("COMPLETE_FLOW", { extras: { currencyName } });
      onCloseModal();
    }
  }, [activeFlow, currencyName, onClearContextualOverlayQueue, onCloseModal, send]);

  return (
    <>
      <Box horizontal alignItems="center" justifyContent="space-between" grow>
        <Button
          event="Page AddAccounts Step 4 AddMore"
          id={"add-accounts-finish-add-more-button"}
          outlineGrey
          onClick={onGoStep1}
        >
          {t("addAccounts.cta.addMore")}
        </Button>
        <Button
          event="Page AddAccounts Step 4 AddMore"
          id={"add-accounts-finish-close-button"}
          primary
          onClick={onCloseModal}
        >
          {t("common.done")}
        </Button>
      </Box>
    </>
  );
}

const Title = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 5,
  mt: 2,
  color: "palette.text.shade100",
}))`
  text-align: center;
`;

const Text = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 4,
  mt: 2,
}))`
  text-align: center;
`;
