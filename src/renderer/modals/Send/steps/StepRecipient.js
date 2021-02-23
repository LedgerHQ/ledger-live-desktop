// @flow

import React, { useLayoutEffect, useCallback, useEffect } from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Label from "~/renderer/components/Label";
import SelectAccount from "~/renderer/components/SelectAccount";

import SendRecipientFields, { getFields } from "../SendRecipientFields";
import RecipientField from "../fields/RecipientField";

import type { StepProps } from "../types";

import StepRecipientSeparator from "~/renderer/components/StepRecipientSeparator";
import {
  useSetOverlays,
  useOnSetOverlays,
  useOnClearOverlays,
  useActiveFlow,
} from "~/renderer/components/ProductTour/hooks";

const StepRecipient = ({
  t,
  account,
  parentAccount,
  openedFromAccount,
  transaction,
  onChangeAccount,
  onChangeTransaction,
  error,
  status,
  bridgePending,
  maybeRecipient,
  onResetMaybeRecipient,
}: StepProps) => {
  const activeFlow = useActiveFlow();
  useSetOverlays(true, {
    selector: "#send-source",
    i18nKey: "productTour.flows.send.overlays.source",
    config: { bottom: true, right: true, disableScroll: true, padding: 10 },
  });

  const onRecipientAddressOverlay = useOnSetOverlays({
    selector: "#send-destination",
    i18nKey: "productTour.flows.send.overlays.destination",
    config: {
      bottom: true,
      left: true,
      disableScroll: true,
      padding: 10,
    },
  });
  const onRestoreRecipientOverlay = useOnSetOverlays({
    selector: "#send-source",
    i18nKey: "productTour.flows.send.overlays.source",
    config: { bottom: true, right: true, disableScroll: true, withFeedback: true, padding: 10 },
  });

  const onChooseFirstAccountOverlay = useOnSetOverlays({
    selector: ".select-options-list",
    i18nKey: "productTour.flows.send.overlays.account",
    config: { top: true },
  });

  const wrappedOnChangeAccount = useCallback(
    (nextAccount: AccountLike, nextParentAccount: ?Account) => {
      onRecipientAddressOverlay();
      onChangeAccount(nextAccount, nextParentAccount);
    },
    [onChangeAccount, onRecipientAddressOverlay],
  );

  if (!status) return null;
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;

  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step Recipient" />
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box id={"send-source"} flow={1}>
        <Label>{t("send.steps.details.selectAccountDebit")}</Label>
        <SelectAccount
          onMenuOpen={activeFlow === "send" ? onChooseFirstAccountOverlay : undefined}
          onMenuClose={activeFlow === "send" ? onRestoreRecipientOverlay : undefined}
          withSubAccounts
          enforceHideEmptySubAccounts
          autoFocus={!openedFromAccount}
          onChange={wrappedOnChangeAccount}
          value={account}
        />
      </Box>
      <StepRecipientSeparator />
      {account && transaction && mainAccount && (
        <Box id={"send-destination"}>
          <RecipientField
            status={status}
            autoFocus={openedFromAccount}
            account={mainAccount}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            bridgePending={bridgePending}
            t={t}
            initValue={maybeRecipient}
            resetInitValue={onResetMaybeRecipient}
          />
          <SendRecipientFields
            account={mainAccount}
            status={status}
            transaction={transaction}
            onChange={onChangeTransaction}
          />
        </Box>
      )}
    </Box>
  );
};

export const StepRecipientFooter = ({
  t,
  account,
  parentAccount,
  status,
  bridgePending,
  transitionTo,
}: StepProps) => {
  const { errors } = status;

  const mainAccount = account ? getMainAccount(account, parentAccount) : null;

  const isTerminated = mainAccount && mainAccount.currency.terminated;
  const fields = ["recipient"].concat(mainAccount ? getFields(mainAccount) : []);
  const hasFieldError = Object.keys(errors).some(name => fields.includes(name));
  const canNext = !bridgePending && !hasFieldError && !isTerminated;
  const onClearOverlays = useOnClearOverlays();

  useSetOverlays(!!status, {
    selector: "#send-source",
    i18nKey: "productTour.flows.send.overlays.source",
    config: { bottom: true, right: true, disableScroll: true, withFeedback: true, padding: 10 },
  });

  useEffect(() => {
    if (canNext) {
      onClearOverlays();
    }
  }, [canNext, onClearOverlays]);

  const onNext = async () => {
    transitionTo("amount");
  };

  return (
    <>
      <Button
        id={"send-recipient-continue-button"}
        isLoading={bridgePending}
        primary
        disabled={!canNext}
        onClick={onNext}
      >
        {t("common.continue")}
      </Button>
    </>
  );
};

export default StepRecipient;
