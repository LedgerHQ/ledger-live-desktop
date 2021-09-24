// @flow
import type { SwapTransactionType } from "@ledgerhq/live-common/lib/exchange/swap/hooks";

export type FormSummarySections = "provider" | "fees" | "rate" | "target";
export type FormSummaryProps = {
  provider?: string,
  rate?: string,
  fees?: string,
  onProviderChange: Function,
  onFeesChange: Function,
  onTargetChange: Function,
  swapTransaction: SwapTransactionType,
};
