// @flow
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { useSolanaStakesWithMeta } from "@ledgerhq/live-common/lib/families/solana/react";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Image from "~/renderer/components/Image";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import { Ellipsis } from "../../shared/components/Ellipsis";
import ErrorDisplay from "../../shared/components/ErrorDisplay";
import type { StepProps } from "../types";

export default function StepValidator({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  error,
  t,
}: StepProps) {
  if (account === null || transaction === null || account?.solanaResources === undefined) {
    throw new Error("account, transaction and solana resouces required");
  }

  const { solanaResources } = account;

  if (transaction?.model.kind !== "stake.delegate") {
    throw new Error("unsupported transaction");
  }

  const { stakeAccAddr } = transaction.model.uiState;

  const stakesWithMeta = useSolanaStakesWithMeta(account.currency, solanaResources.stakes);

  const stakeWithMeta = stakesWithMeta.find(s => s.stake.stakeAccAddr === stakeAccAddr);

  if (stakeWithMeta === undefined) {
    throw new Error(`stake with account address <${stakeAccAddr}> not found`);
  }

  const { meta, stake } = stakeWithMeta;
  const validatorName = meta.validator?.name ?? stakeAccAddr;

  const formatAmount = (amount: number) => {
    const unit = getAccountUnit(account);
    return formatCurrencyUnit(unit, new BigNumber(amount), {
      disableRounding: true,
      alwaysShowSign: false,
      showCode: true,
    });
  };

  return (
    <Box flow={1}>
      <TrackPage category="Solana Delegation Reactivate" name="Step Validator" />
      {error && <ErrorBanner error={error} />}
      <Box horizontal>
        <Box mr={1}>
          {meta.validator?.img !== undefined && (
            <Image resource={meta.validator.img} height={32} width={32} alt="" />
          )}
          {meta.validator?.img === undefined && <FirstLetterIcon label={validatorName ?? "-"} />}
        </Box>
        <Ellipsis>{validatorName}</Ellipsis>
      </Box>
      <Box>
        {t("delegation.delegated")}: {formatAmount(stake.delegation?.stake ?? 0)}
      </Box>
      {status.errors.fee && <ErrorDisplay error={status.errors.fee} />}
    </Box>
  );
}

export function StepValidatorFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length > 0;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          id="delegate-continue-button"
          disabled={!canNext}
          primary
          onClick={() => transitionTo("connectDevice")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
