// @flow
import React from "react";
import FormSummary from "./FormSummary";
import type { FormSummaryStandardSections, FormSummaryProps } from "./types";

const standardSections: Array<FormSummaryStandardSections> = ["provider", "rate", "fees"];

const SwapFormSummary = (props: FormSummaryProps) => (
  <FormSummary {...props}>
    {standardSections.map(section => (
      <FormSummary.Section key={section} section={section}>
        <FormSummary.Label />
        <FormSummary.Value />
      </FormSummary.Section>
    ))}
    <FormSummary.SectionTarget>
      <FormSummary.Label />
      <FormSummary.Value />
    </FormSummary.SectionTarget>
  </FormSummary>
);

export default SwapFormSummary;
