// @flow

import invariant from "invariant";
import React, { useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import type { AccountLike, Account, Transaction } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { getAccountUnit, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import Text from "~/renderer/components/Text";
import WarnBox from "~/renderer/components/WarnBox";
import Box from "~/renderer/components/Box";

import { formatDelegationsInfo } from "./operationDetails";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import {
  OpDetailsData,
  OpDetailsVoteData,
  Address,
} from "~/renderer/modals/OperationDetails/styledComponents";

const Info: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  mt: 6,
  mb: 4,
  px: 5,
}))`
  text-align: center;
`;

const AddressText = styled(Text).attrs(() => ({
  ml: 1,
  ff: "Inter|Medium",
  color: "palette.text.shade80",
  fontSize: 3,
}))`
  word-break: break-all;
  text-align: right;
  max-width: 50%;
`;

const CosmosValidatorsField = ({
  account,
  parentAccount,
  transaction,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
}) => {
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "cosmos", "cosmos transaction");

  const unit = getAccountUnit(mainAccount);

  const { validators } = transaction;
  const { validators: cosmosValidators } = useCosmosPreloadData();

  const formatedValidators = formatDelegationsInfo(validators || [], cosmosValidators);

  return transaction.mode === "claimReward" || transaction.mode === "claimRewardCompound" ? (
    <>
      <TransactionConfirmField label="Validator">
        <AddressText ff="Inter|SemiBold">{formatedValidators[0].address}</AddressText>
      </TransactionConfirmField>
      <TransactionConfirmField label="Reward amount">
        <AddressText ff="Inter|SemiBold">
          {formatCurrencyUnit(unit, formatedValidators[0].amount, {
            disableRounding: false,
            alwaysShowSign: false,
            showCode: true,
          })}
        </AddressText>
      </TransactionConfirmField>
    </>
  ) : (
    formatedValidators && formatedValidators.length > 0 && (
      <Box vertical justifyContent="space-between" mb={2}>
        <TransactionConfirmField label={`Validators (${formatedValidators.length})`} />

        {formatedValidators
          .map(({ amount, ...delegation }) => ({
            ...delegation,
            amount: formatCurrencyUnit(unit, BigNumber(amount), {
              disableRounding: false,
              alwaysShowSign: false,
              showCode: true,
            }),
          }))
          .map(({ amount, address, validator }, i) => (
            <OpDetailsData key={address + i}>
              <OpDetailsVoteData>
                <Box>
                  <Text>
                    <Trans
                      i18nKey="operationDetails.extra.votesAddress"
                      values={{
                        votes: amount,
                        name: validator ? validator.name : address,
                      }}
                    >
                      <Text ff="Inter|SemiBold">{""}</Text>
                      {""}
                      <Text ff="Inter|SemiBold">{""}</Text>
                    </Trans>
                  </Text>
                </Box>
                <Address>{address}</Address>
              </OpDetailsVoteData>
            </OpDetailsData>
          ))}
      </Box>
    )
  );
};

const CosmosSourceValidatorField = ({
  account,
  parentAccount,
  transaction,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
}) => {
  invariant(transaction.family === "cosmos", "cosmos transaction");

  const { cosmosSourceValidator } = transaction;
  const { validators: cosmosValidators } = useCosmosPreloadData();
  const formattedValidator = useMemo(
    () => cosmosValidators.find(v => v.validatorAddress === cosmosSourceValidator),
    [cosmosValidators, cosmosSourceValidator],
  );

  return (
    cosmosSourceValidator && (
      <TransactionConfirmField label="From">
        <Box alignContent="flex-end" vertical>
          <Text ff="Inter|Medium" fontSize={4}>
            {formattedValidator && formattedValidator.name}
          </Text>
          <AddressText ff="Inter|Regular" fontSize={3}>
            {cosmosSourceValidator.slice(0, 1).toUpperCase() +
              cosmosSourceValidator.slice(1).toLowerCase()}
          </AddressText>
        </Box>
      </TransactionConfirmField>
    )
  );
};

const Warning = ({
  transaction,
  recipientWording,
}: {
  transaction: Transaction,
  recipientWording: string,
}) => {
  invariant(transaction.family === "cosmos", "cosmos transaction");

  switch (transaction.mode) {
    case "delegate":
    case "undelegate":
    case "redelegate":
    case "claimReward":
    case "claimRewardCompound":
      return null;
    default:
      return (
        <WarnBox>
          <Trans i18nKey="TransactionConfirm.warning" values={{ recipientWording }} />
        </WarnBox>
      );
  }
};

const Title = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "cosmos", "cosmos transaction");

  return (
    <Info>
      <Trans i18nKey={`TransactionConfirm.titleWording.${transaction.mode}`} />
    </Info>
  );
};

const fieldComponents = {
  "cosmos.cosmosSourceValidator": CosmosSourceValidatorField,
  "cosmos.validators": CosmosValidatorsField,
};

export default {
  fieldComponents,
  warning: Warning,
  title: Title,
  disableFees: () => true,
};
