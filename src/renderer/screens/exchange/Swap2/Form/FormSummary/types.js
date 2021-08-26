// @flow
import type { SwapTransactionType } from "../../utils/shared/useSwapTransaction";

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
