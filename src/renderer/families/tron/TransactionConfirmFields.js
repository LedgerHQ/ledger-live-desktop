// @flow

import invariant from "invariant";
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { AccountLike, Account, Transaction } from "@ledgerhq/live-common/lib/types";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import Text from "~/renderer/components/Text";
import WarnBox from "~/renderer/components/WarnBox";
import Box from "~/renderer/components/Box";
import { OperationDetailsVotes } from "./operationDetails";

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
  ma-wwidth: 50%;
`;

const Pre = ({
  account,
  parentAccount,
  transaction,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
}) => {
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "tron", "tron transaction");

  const from = account.type === "ChildAccount" ? account.address : mainAccount.freshAddress;

  return (
    <>
      <TransactionConfirmField label={<Trans i18nKey="TransactionConfirm.fromAddress" />}>
        <AddressText>{from}</AddressText>
      </TransactionConfirmField>
      {transaction.recipient && transaction.recipient !== from && (
        <TransactionConfirmField label={<Trans i18nKey="TransactionConfirm.toAddress" />}>
          <AddressText>{transaction.recipient}</AddressText>
        </TransactionConfirmField>
      )}

      {transaction.resource && (
        <TransactionConfirmField label={<Trans i18nKey="TransactionConfirm.resource" />}>
          <AddressText ff="Inter|SemiBold">{transaction.resource}</AddressText>
        </TransactionConfirmField>
      )}
      {transaction.votes && transaction.votes.length > 0 && (
        <Box vertical justifyContent="space-between" mb={2}>
          <Box mb={2}>
            <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={3}>
              <Trans i18nKey="TransactionConfirm.votes" />
            </Text>
          </Box>

          <OperationDetailsVotes
            votes={transaction.votes}
            account={mainAccount}
            isTransactionField
          />
        </Box>
      )}
    </>
  );
};

const Post = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "tron", "tron transaction");

  return null;
};

const Warning = ({
  transaction,
  recipientWording,
}: {
  transaction: Transaction,
  recipientWording: string,
}) => {
  invariant(transaction.family === "tron", "tron transaction");

  switch (transaction.mode) {
    case "claimReward":
    case "freeze":
    case "unfreeze":
    case "vote":
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
  invariant(transaction.family === "tron", "tron transaction");

  return (
    <Info>
      <Trans i18nKey={`TransactionConfirm.titleWording.${transaction.mode}`} />
    </Info>
  );
};

export default {
  pre: Pre,
  post: Post,
  warning: Warning,
  title: Title,
};
