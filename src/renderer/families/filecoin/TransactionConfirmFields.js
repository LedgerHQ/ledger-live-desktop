// @flow

import invariant from "invariant";
import React from "react";
import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import Text from "~/renderer/components/Text";
import { DeviceTransactionField } from "@ledgerhq/live-common/lib/transaction";


const addressStyle = {
  wordBreak: "break-all",
  textAlign: "right",
  maxWidth: "70%",
};

const FilecoinField = ({ transaction, field }: { transaction: Transaction, field: DeviceTransactionField }) => {
  invariant(transaction.family === "filecoin", "filecoin transaction");

  return (
    <TransactionConfirmField label={field.label}>
      <Text style={addressStyle} ml={1} ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
        {field.value}
      </Text>
    </TransactionConfirmField>
  );
};

const fieldComponents = {
  "filecoin.gasFeeCap": FilecoinField,
  "filecoin.gasPremium": FilecoinField,
  "filecoin.gasLimit": FilecoinField,
  "filecoin.method": FilecoinField,
};

export default {
  fieldComponents,
};
