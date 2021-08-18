import React from "react";
import ProgressBar, { Props } from "@components/ProgressBar";

export default {
  title: "Navigation/ProgressBars/SidePanel",
  component: ProgressBar,
  argTypes: {
    activeIndex: {
      control: { type: "number" },
    },
  },
};

export const Component = (args: Props): JSX.Element => <ProgressBar {...args} />;
Component.args = {
  steps: ["Crypto Asset", "Device", "Accounts", "Confirmation"],
  activeIndex: 1,
};
