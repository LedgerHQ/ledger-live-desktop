// @flow
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import Box from "~/renderer/components/Box";
import SendAmountFields from "~/renderer/modals/Send/SendAmountFields";
import { transactionSelector } from "~/renderer/actions/swap";
import type {
  SwapTransactionType,
  SwapSelectorStateType,
} from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import { DrawerTitle } from "../DrawerTitle";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SWAP_VERSION } from "../../utils/index";

type Props = {
  setTransaction: $PropertyType<SwapTransactionType, "setTransaction">,
  updateTransaction: $PropertyType<SwapTransactionType, "updateTransaction">,
  account: $PropertyType<SwapSelectorStateType, "account">,
  parentAccount: $PropertyType<SwapSelectorStateType, "parentAccount">,
  currency: $PropertyType<SwapSelectorStateType, "currency">,
  status: $PropertyType<SwapTransactionType, "status">,
  disableSlowStrategy?: boolean,
  provider: ?string,
};
export default function FeesDrawer({
  setTransaction,
  updateTransaction,
  account,
  parentAccount,
  currency,
  status,
  provider,
  disableSlowStrategy = false,
}: Props) {
  const transaction = useSelector(transactionSelector);

  const mapStrategies = useCallback(
    strategy =>
      strategy.label === "slow" && disableSlowStrategy ? { ...strategy, disabled: true } : strategy,
    [disableSlowStrategy],
  );

  return (
    <Box height="100%">
      <TrackPage
        category="Swap"
        name="Form - Edit Fees"
        sourcecurrency={currency?.name}
        provider={provider}
        swapVersion={SWAP_VERSION}
      />
      <DrawerTitle i18nKey="swap2.form.details.label.fees" />
      <Box mt={3} flow={4}>
        {transaction.networkInfo && (
          <SendAmountFields
            account={account}
            parentAccount={parentAccount}
            status={status}
            transaction={transaction}
            onChange={setTransaction}
            updateTransaction={updateTransaction}
            mapStrategies={mapStrategies}
          />
        )}
      </Box>
    </Box>
  );
}
