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

type Props = {
  onChange: Transaction => void,
  transaction: Transaction,
  account: Account,
  t: TFunction,
};

const MemoField = ({ onChange, account, transaction, t }: Props) => {
  invariant(transaction.family === "solana", "MemoField: solana family expected");

  const onChangeMemo = useCallback(
    memo => {
      const bridge = getAccountBridge(account);
      onChange(bridge.updateTransaction(transaction, { memo }));
    },
    [onChange, account, transaction],
  );

  return (
    <Box vertical flow={5}>
      <Box grow>
        <Label mb={5}>
          <span>Memo</span>
        </Label>
        <Input placeholder="Memo" value={String(transaction.memo || "")} onChange={onChangeMemo} />
      </Box>
    </Box>
  );
};

export default {
  component: withTranslation()(MemoField),
  fields: ["memo"],
};
