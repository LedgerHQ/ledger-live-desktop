// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { CurrencyCircleIcon } from "~/renderer/components/CurrencyBadge";
import RefreshAccountsOrdering from "~/renderer/components/RefreshAccountsOrdering";
import type { StepProps } from "..";

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

const StepFinish = ({ currency, checkedAccountsIds }: StepProps) => {
  const { t } = useTranslation();

  const currencyName = currency
    ? currency.type === "TokenCurrency"
      ? currency.parentCurrency.name
      : currency.name
    : undefined;

  return (
    <Box alignItems="center" py={6}>
      <RefreshAccountsOrdering onMount onUnmount />
      {/* onMount because if we already have the countervalues we want to sort it straightaway
          onUnmount because if not, it is useful to trigger a second refresh to ensure it get sorted */}

      <TrackPage category="AddAccounts" name="Step4" currencyName={currencyName} />
      {currency ? <CurrencyCircleIcon currency={currency} size={50} showCheckmark /> : null}
      <Title>{t("addAccounts.success", { count: checkedAccountsIds.length })}</Title>
      <Text>{t("addAccounts.successDescription", { count: checkedAccountsIds.length })}</Text>
    </Box>
  );
};

export default StepFinish;

export const StepFinishFooter = ({ onGoStep1, onCloseModal }: StepProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
        <Button id={"add-accounts-finish-close-button"} onClick={onCloseModal}>
          {t("common.close")}
        </Button>
        <Button
          event="Page AddAccounts Step 4 AddMore"
          id={"add-accounts-finish-add-more-button"}
          primary
          onClick={onGoStep1}
        >
          {t("addAccounts.cta.addMore")}
        </Button>
      </Box>
    </>
  );
};
