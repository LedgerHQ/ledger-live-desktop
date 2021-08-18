import React from "react";
import { Step, StepProps } from "@components/ProgressBar";

export default {
  title: "Navigation/ProgressBars/SidePanel/Item",
  component: Step,
};

export const Item = (args: StepProps): JSX.Element => (
  <div style={{ width: "75px" }}>
    <Step {...args} />
  </div>
);
Item.args = {
  state: "current",
  label: "label",
  hideLeftSeparator: true,
  nextState: undefined,
};
