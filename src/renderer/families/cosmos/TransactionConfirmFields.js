// @flow

import invariant from "invariant";
import React, { useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { Transaction } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { FieldComponentProps } from "~/renderer/components/TransactionConfirm";

import { getAccountUnit, getMainAccount } from "@ledgerhq/live-common/lib/account";

import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import Text from "~/renderer/components/Text";
import WarnBox from "~/renderer/components/WarnBox";
import Box from "~/renderer/components/Box";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import { mapDelegationInfo } from "@ledgerhq/live-common/lib/families/cosmos/logic";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { openURL } from "~/renderer/linking";

import {
  OpDetailsData,
  OpDetailsVoteData,
} from "~/renderer/modals/OperationDetails/styledComponents";
import FormattedVal from "~/renderer/components/FormattedVal";

const Info: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  mb: 4,
  px: 5,
}))`
  text-align: center;
`;

const FieldText = styled(Text).attrs(() => ({
  ml: 1,
  ff: "Inter|Medium",
  color: "palette.text.shade80",
  fontSize: 3,
}))`
  word-break: break-all;
  text-align: right;
  max-width: 50%;
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
  ${p =>
    p.onClick
      ? `
      cursor: pointer;
    &:hover {
      color: ${p.theme.colors.palette.primary.main};
    }
  `
      : ``}
`;

const onExternalLink = (account, address) => {
  const explorerView = getDefaultExplorerView(account.currency);
  const URL = explorerView && getAddressExplorer(explorerView, address);
  if (URL) openURL(URL);
};

const CosmosDelegateValidatorsField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "cosmos", "cosmos transaction");

  const unit = getAccountUnit(mainAccount);

  const { validators } = transaction;
  const { validators: cosmosValidators } = useCosmosPreloadData();

  const mappedValidators = mapDelegationInfo(validators || [], cosmosValidators, unit);

  return mappedValidators && mappedValidators.length > 0 ? (
    <Box vertical justifyContent="space-between" mb={2}>
      <TransactionConfirmField label={field.label} />
      {mappedValidators.map(({ formattedAmount, validator, address }, i) => (
        <OpDetailsData key={address + i}>
          <OpDetailsVoteData>
            <Box>
              <Text>
                <Trans
                  i18nKey="operationDetails.extra.votesAddress"
                  values={{
                    votes: formattedAmount,
                    name: validator?.name ?? address,
                  }}
                >
                  <Text ff="Inter|SemiBold">{""}</Text>
                  {""}
                  <Text ff="Inter|SemiBold">{""}</Text>
                </Trans>
              </Text>
            </Box>
            <AddressText onClick={() => onExternalLink(mainAccount, address)}>
              {address}
            </AddressText>
          </OpDetailsVoteData>
        </OpDetailsData>
      ))}
    </Box>
  ) : null;
};

const CosmosValidatorNameField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  invariant(transaction.family === "cosmos", "cosmos transaction");
  const mainAccount = getMainAccount(account, parentAccount);

  const { validators } = transaction;
  const { validators: cosmosValidators } = useCosmosPreloadData();

  const address = validators && validators.length > 0 ? validators[0].address : null;

  const formattedValidator = useMemo(
    () => (address ? cosmosValidators.find(v => v.validatorAddress === address) : null),
    [address, cosmosValidators],
  );

  return address ? (
    <TransactionConfirmField label={field.label}>
      <FieldText>
        <Text ff="Inter|Medium" fontSize={4}>
          {formattedValidator && formattedValidator.name}
        </Text>
        <br />
        <AddressText
          ff="Inter|Regular"
          fontSize={2}
          onClick={() => onExternalLink(mainAccount, address)}
        >
          {address}
        </AddressText>
      </FieldText>
    </TransactionConfirmField>
  ) : null;
};

const CosmosValidatorAmountField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "cosmos", "cosmos transaction");

  const unit = getAccountUnit(mainAccount);

  const { validators } = transaction;

  return validators && validators.length > 0 ? (
    <TransactionConfirmField label={field.label}>
      <FieldText>
        <FormattedVal
          color={"palette.text.shade80"}
          unit={unit}
          val={validators[0].amount}
          fontSize={3}
          showCode
        />
      </FieldText>
    </TransactionConfirmField>
  ) : null;
};

const CosmosSourceValidatorField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  invariant(transaction.family === "cosmos", "cosmos transaction");
  const mainAccount = getMainAccount(account, parentAccount);

  const { cosmosSourceValidator } = transaction;
  const { validators: cosmosValidators } = useCosmosPreloadData();
  const formattedValidator = useMemo(
    () => cosmosValidators.find(v => v.validatorAddress === cosmosSourceValidator),
    [cosmosValidators, cosmosSourceValidator],
  );

  return formattedValidator ? (
    <TransactionConfirmField label={field.label}>
      <FieldText>
        <Text ff="Inter|Medium" fontSize={4}>
          {formattedValidator.name}
        </Text>
        <br />
        <AddressText
          ff="Inter|Regular"
          fontSize={2}
          onClick={() => onExternalLink(mainAccount, formattedValidator.validatorAddress)}
        >
          {formattedValidator.validatorAddress}
        </AddressText>
      </FieldText>
    </TransactionConfirmField>
  ) : null;
};

const CosmosMemoField = ({ account, parentAccount, transaction, field }: FieldComponentProps) => {
  invariant(transaction.family === "cosmos", "cosmos transaction");

  const { memo } = transaction;

  return memo ? (
    <TransactionConfirmField label={field.label}>
      <FieldText>{memo}</FieldText>
    </TransactionConfirmField>
  ) : null;
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
  "cosmos.memo": CosmosMemoField,
  "cosmos.delegateValidators": CosmosDelegateValidatorsField,
  "cosmos.validatorName": CosmosValidatorNameField,
  "cosmos.validatorAmount": CosmosValidatorAmountField,
  "cosmos.sourceValidatorName": CosmosSourceValidatorField,
};

export default {
  fieldComponents,
  warning: Warning,
  title: Title,
  disableFees: () => true,
};
