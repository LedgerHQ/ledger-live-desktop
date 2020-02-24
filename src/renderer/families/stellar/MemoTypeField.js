// @flow

import React, { useCallback, useState } from "react";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { StellarMemoType } from "@ledgerhq/live-common/lib/families/stellar/types";
import Select from "~/renderer/components/Select";
import invariant from "invariant";

const MemoTypeField = ({ onChange, account, transaction }: Props) => {
    invariant(transaction.family === "stellar", "MemoTypeField: stellar family expected");

    const bridge = getAccountBridge(account);

    const options = StellarMemoType.map(type => ({
        label: type,
        value: type,
    }));

    const [selectedMemoType, setSelectedMemoType] = useState(
        transaction.memoType
            ? options.find(option => option.value === transaction.memoType)
            : options[0],
    );

    const onMemoTypeChange = useCallback(
        memoType => {
            setSelectedMemoType(memoType);
            onChange(bridge.updateTransaction(transaction, { memoType: memoType.value }));
        },
        [onChange, transaction, bridge],
    );

    useCallback(() => {
        setSelectedMemoType(
            transaction.memoType
                ? options.find(option => option.value === transaction.memoType)
                : options[0],
        );
    }, [transaction.memoType, options]);

    return (
        <Select
            width={"156px"}
            isSearchable={false}
            onChange={onMemoTypeChange}
            value={selectedMemoType}
            options={options}
        />
    );
};

export default MemoTypeField;