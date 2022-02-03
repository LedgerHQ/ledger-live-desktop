// @flow
import invariant from "invariant";
import React from "react";
import styled from "styled-components";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import Text from "~/renderer/components/Text";
import type { FieldComponentProps } from "~/renderer/components/TransactionConfirm";

const deviceMemoLabels = {
  MEMO_TEXT: "Memo Text",
  NO_MEMO: "Memo",
  MEMO_ID: "Memo ID",
  MEMO_HASH: "Memo Hash",
  MEMO_RETURN: "Memo Return",
};

const addressStyle = {
  wordBreak: "break-all",
  textAlign: "right",
  maxWidth: "70%",
};

const WrappedAssetIssuer = styled(Text)`
  word-break: break-all;
  text-align: right;
  flex: 1;
  padding-left: 20px;
`;

const StellarMemoField = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "stellar", "stellar transaction");

  return (
    <TransactionConfirmField label={deviceMemoLabels[transaction.memoType || "NO_MEMO"]}>
      <Text style={addressStyle} ml={1} ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
        {transaction.memoValue ? `${transaction.memoValue} ` : "[none]"}
      </Text>
    </TransactionConfirmField>
  );
};

// NB once we support other networks, we can make this not hardcoded.
const StellarNetworkField = ({ field }: FieldComponentProps) => (
  <TransactionConfirmField label={field.label}>
    <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
      {"Public"}
    </Text>
  </TransactionConfirmField>
);

const StellarAssetCodeField = ({
  transaction,
  field,
}: {
  transaction: Transaction,
  field: FieldComponentProps,
}) => {
  invariant(transaction.family === "stellar", "stellar transaction");

  return (
    <TransactionConfirmField label={field.label}>
      <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
        {transaction.assetCode}
      </Text>
    </TransactionConfirmField>
  );
};

const StellarAssetIssuerField = ({
  transaction,
  field,
}: {
  transaction: Transaction,
  field: FieldComponentProps,
}) => {
  invariant(transaction.family === "stellar", "stellar transaction");

  return (
    <TransactionConfirmField label={field.label}>
      <WrappedAssetIssuer ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
        {transaction.assetIssuer}
      </WrappedAssetIssuer>
    </TransactionConfirmField>
  );
};

const fieldComponents = {
  "stellar.memo": StellarMemoField,
  "stellar.network": StellarNetworkField,
  "stellar.assetCode": StellarAssetCodeField,
  "stellar.assetIssuer": StellarAssetIssuerField,
};

export default {
  fieldComponents,
};
