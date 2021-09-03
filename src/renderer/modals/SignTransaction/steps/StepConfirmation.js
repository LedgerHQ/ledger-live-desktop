// @flow

import React from "react";
import styled, { withTheme } from "styled-components";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import RetryButton from "~/renderer/components/RetryButton";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";

import type { StepProps } from "../types";

const Container: ThemedComponent<{ shouldSpace?: boolean }> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: ${p => (p.shouldSpace ? "space-between" : "center")};
  min-height: 220px;
`;

function StepConfirmation({ account, t, error, theme, device }: StepProps & { theme: * }) {
  const currency = account && getAccountCurrency(account);
  const currencyName = currency?.name ?? "";

  if (error) {
    return (
      <Container>
        <TrackPage
          category="Sign Transaction Flow"
          name="Step Confirmation Error"
          currencyName={currencyName}
        />
        <ErrorDisplay error={error} withExportLogs />
      </Container>
    );
  }

  return null;
}

export function StepConfirmationFooter({
  t,
  transitionTo,
  account,
  parentAccount,
  onRetry,
  error,
  openModal,
  closeModal,
}: StepProps) {
  return (
    <>
      {error ? (
        <RetryButton
          ml={2}
          primary
          onClick={() => {
            onRetry();
            transitionTo("summary");
          }}
        />
      ) : null}
    </>
  );
}

export default withTheme(StepConfirmation);
