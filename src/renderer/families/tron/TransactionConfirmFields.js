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
  max-width: 50%;
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

  const { votes, resource } = transaction;

  return (
    <>
      {resource && (
        <TransactionConfirmField label="Resource">
          <AddressText ff="Inter|SemiBold">
            {resource.slice(0, 1).toUpperCase() + resource.slice(1).toLowerCase()}
          </AddressText>
        </TransactionConfirmField>
      )}

      {votes && votes.length > 0 && (
        <Box vertical justifyContent="space-between" mb={2}>
          <TransactionConfirmField
            label={
              <Trans
                i18nKey="TransactionConfirm.votes"
                count={votes.length}
                values={{ count: votes.length }}
              />
            }
          />

          <OperationDetailsVotes votes={votes} account={mainAccount} isTransactionField />
        </Box>
      )}
    </>
  );
};

const Post = ({
  transaction,
  account,
  parentAccount,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
}) => {
  invariant(transaction.family === "tron", "tron transaction");
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "tron", "tron transaction");

  const from = mainAccount.freshAddress;

  const { mode } = transaction;

  return (
    <>
      {(mode === "freeze" || mode === "unfreeze") && (
        <TransactionConfirmField label={mode === "freeze" ? "Freeze To" : "Delegate To"}>
          <AddressText>{from}</AddressText>
        </TransactionConfirmField>
      )}

      {mode !== "send" ? (
        <TransactionConfirmField label="From Address">
          <AddressText>{from}</AddressText>
        </TransactionConfirmField>
      ) : null}
    </>
  );
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
  disableFees: () => true,
};
