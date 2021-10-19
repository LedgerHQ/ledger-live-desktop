// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import { BigNumber } from "bignumber.js";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { Account, Transaction } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import Label from "~/renderer/components/Label";
import type { TransactionStatus } from "@ledgerhq/live-common/lib/types";
import { NotEnoughBalanceBecauseDestinationNotCreated } from "@ledgerhq/errors";
import CheckBox from "~/renderer/components/CheckBox";

type Props = {
  account: Account,
  status: TransactionStatus,
  onChange: Transaction => void,
  transaction: Transaction,
};

const Root = ({ onChange, account, transaction, status }: Props) => {
  invariant(transaction.family === "solana", "solana family expected");

  const onChangeTx = useCallback(
    patch => {
      const bridge = getAccountBridge(account);
      onChange(bridge.updateTransaction(transaction, patch));
    },
    [onChange, account, transaction],
  );

  const isRecipientNotCreatedError =
    status.errors.recipient instanceof NotEnoughBalanceBecauseDestinationNotCreated;

  return (
    <Box flow={2}>
      <Box horizontal>
        <CheckBox
          disabled={!isRecipientNotCreatedError}
          isChecked={transaction.allowNotCreatedRecipient}
          onChange={allowNotCreatedRecipient => onChangeTx({ allowNotCreatedRecipient })}
        />
        <Label ml={5}>
          <span>Allow not created recipient</span>
        </Label>
      </Box>
      <Box>
        <Label mb={5}>
          <span>Memo</span>
        </Label>
        <Input
          placeholder="Memo"
          value={transaction.memo || ""}
          onChange={memo => onChangeTx({ memo })}
        />
      </Box>
    </Box>
  );
};

export default {
  component: withTranslation()(Root),
  fields: ["memo", "allowNotCreatedRecipient"],
};
