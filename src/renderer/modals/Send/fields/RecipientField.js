// @flow
import React, { useCallback, useEffect } from "react";
import { RecipientRequired } from "@ledgerhq/errors";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { Account, Transaction, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";

import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import RecipientAddress from "~/renderer/components/RecipientAddress";

type Props = {
  account: Account,
  transaction: Transaction,
  autoFocus?: boolean,
  status: TransactionStatus,
  onChangeTransaction: Transaction => void,
  t: TFunction,
  label?: React$Node,
  initValue?: string,
  resetInitValue?: () => void,
};

const RecipientField = ({
  t,
  account,
  transaction,
  onChangeTransaction,
  autoFocus,
  status,
  label,
  initValue,
  resetInitValue,
}: Props) => {
  const bridge = getAccountBridge(account, null);

  useEffect(() => {
    if (initValue && initValue !== transaction.recipient) {
      onChangeTransaction(bridge.updateTransaction(transaction, { recipient: initValue }));
      resetInitValue && resetInitValue();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = useCallback(
    async (recipient: string, maybeExtra: ?Object) => {
      const { currency } = maybeExtra || {}; // FIXME fromQRCode ?
      const invalidRecipient = currency && currency.scheme !== account.currency.scheme;
      onChangeTransaction(
        bridge.updateTransaction(transaction, { recipient: invalidRecipient ? "" : recipient }),
      );
    },
    [bridge, account, transaction, onChangeTransaction],
  );

  if (!status) return null;
  const { recipient: recipientError } = status.errors;
  const { recipient: recipientWarning } = status.warnings;

  return (
    <Box flow={1}>
      <Label>
        <span>{label || t("send.steps.details.recipientAddress")}</span>
      </Label>
      {/* $FlowFixMe */}
      <RecipientAddress
        placeholder={t("RecipientField.placeholder", { currencyName: account.currency.name })}
        autoFocus={autoFocus}
        withQrCode={!status.recipientIsReadOnly}
        readOnly={status.recipientIsReadOnly}
        error={recipientError instanceof RecipientRequired ? null : recipientError}
        warning={recipientWarning}
        value={transaction.recipient}
        onChange={onChange}
        id={"send-recipient-input"}
      />
    </Box>
  );
};

export default RecipientField;
