// @flow
import React, { useState, useCallback, useMemo, useEffect } from "react";

import SendFeeMode from "~/renderer/components/SendFeeMode";
import SelectFeeStrategy from "~/renderer/components/SelectFeeStrategy";
import GasLimitField from "./GasLimitField";
import GasPriceField from "./GasPriceField";
import { useFeesStrategy } from "@ledgerhq/live-common/lib/families/ethereum/react";
import { getGasLimit } from "@ledgerhq/live-common/lib/families/ethereum/transaction";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { context } from "~/renderer/drawers/Provider";

const hasAdvancedStrategy = transaction => {
  return !["slow", "medium", "fast"].includes(transaction.feesStrategy);
};

const getAdvancedStrategy = transaction => {
  if (hasAdvancedStrategy(transaction)) {
    return {
      label: transaction.feesStrategy,
      amount: transaction.gasPrice,
      displayedAmount: transaction.gasPrice.multipliedBy(getGasLimit(transaction)),
    };
  }

  return null;
};

const Root = (props: *) => {
  const { transaction } = props;
  const { account, updateTransaction } = props;
  const bridge = getAccountBridge(account);
  const { state: drawerState, setDrawer } = React.useContext(context);

  const defaultStrategies = useFeesStrategy(transaction);
  const [advancedStrategy, setAdvancedStrategy] = useState(getAdvancedStrategy(transaction));
  const [isAdvanceMode, setAdvanceMode] = useState(!transaction.feesStrategy);
  const strategies = useMemo(
    () => (advancedStrategy ? [...defaultStrategies, advancedStrategy] : defaultStrategies),
    [defaultStrategies, advancedStrategy],
  );

  useEffect(() => {
    const newAdvancedStrategy = getAdvancedStrategy(transaction);
    if (newAdvancedStrategy) {
      setAdvancedStrategy(newAdvancedStrategy);
    }
  }, [transaction, setAdvancedStrategy]);

  const onFeeStrategyClick = useCallback(
    ({ amount, feesStrategy }) => {
      updateTransaction(transaction =>
        bridge.updateTransaction(transaction, { gasPrice: amount, feesStrategy }),
      );
      if (drawerState.open) setDrawer(undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateTransaction, bridge],
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
