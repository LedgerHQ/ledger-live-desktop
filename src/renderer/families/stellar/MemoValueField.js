// @flow

import React, { useCallback } from "react";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Input from "~/renderer/components/Input";
import invariant from "invariant";

const MemoValueField = ({ onChange, account, transaction, status }: Props) => {
    invariant(transaction.family === "stellar", "MemoTypeField: stellar family expected");

    const bridge = getAccountBridge(account);

    const onMemoValueChange = useCallback(
        memoValue => {
            onChange(bridge.updateTransaction(transaction, { memoValue }));
        },
        [onChange, transaction, bridge],
    );

    // We use transaction as an error here.
    // It will be usefull to block a memo wrong format
    // on the ledger-live mobile
    const { transaction: memoError } = status.errors;
    const { transaction: memoWarning } = status.warnings;

    return (
        <Input
            warning={memoWarning}
            error={memoError}
            value={transaction.memoValue}
            onChange={onMemoValueChange}
        />
    );
};

export default MemoValueField;