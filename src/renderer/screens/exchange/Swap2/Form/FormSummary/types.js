// @flow

export type FormSummaryStandardSections = "provider" | "fees" | "rate";
export type FormSummarySections = FormSummaryStandardSections | "target";
export type FormSummaryProps = {
  provider?: string,
  rate?: string,
  fees?: string,
  onProviderChange: Function,
  onFeesChange: Function,
  onTargetChange: Function,
};
