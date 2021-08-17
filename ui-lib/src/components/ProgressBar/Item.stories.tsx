import React from "react";
import { Step, StepProps } from "@components/ProgressBar";

export default {
  title: "Navigation/ProgressBars/Progress Bar/Item",
  component: Step,
};

const Template = (args: StepProps): JSX.Element => (
  <div style={{ width: "75px" }}>
    <Step {...args} />
  </div>
);
export const Item = Template.bind({});
Item.args = {
  state: "current",
  label: "label",
  hideLeftSeparator: true,
  nextState: undefined,
};
