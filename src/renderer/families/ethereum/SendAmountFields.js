// @flow
import React, { useState, useCallback } from "react";

import SendFeeMode from "~/renderer/components/SendFeeMode";
import SelectFeeStrategy from "~/renderer/components/SelectFeeStrategy";
import GasLimitField from "./GasLimitField";
import GasPriceField from "./GasPriceField";
import { useFeesStrategy } from "@ledgerhq/live-common/lib/families/ethereum/react";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

const Root = (props: *) => {
  const [isAdvanceMode, setAdvanceMode] = useState(!props.transaction.feesStrategy);
  const strategies = useFeesStrategy(props.transaction);
  const { account, transaction, updateTransaction } = props;
  const bridge = getAccountBridge(account);

  const onFeeStrategyClick = useCallback(
    ({ amount, feesStrategy }) => {
      updateTransaction(bridge.updateTransaction(transaction, { gasPrice: amount, feesStrategy }));
    },
    [updateTransaction, bridge, transaction],
  );

  return (
    <>
      <SendFeeMode isAdvanceMode={isAdvanceMode} setAdvanceMode={setAdvanceMode} />
      {isAdvanceMode ? (
        <>
          <GasPriceField {...props} />
          <GasLimitField {...props} />
        </>
      ) : (
        <SelectFeeStrategy strategies={strategies} onClick={onFeeStrategyClick} {...props} />
      )}
    </>
  );
};

export default {
  component: Root,
  fields: ["feeStrategy", "gasLimit", "gasPrice"],
};
