// @flow

import invariant from "invariant";
import React from "react";
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

const fieldComponents = {
  "stellar.memo": StellarMemoField,
  "stellar.network": StellarNetworkField,
};

export default {
  fieldComponents,
};
