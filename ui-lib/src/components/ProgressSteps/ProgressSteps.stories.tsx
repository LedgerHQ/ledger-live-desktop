import React from "react";
import ProgressSteps, { Props } from "@components/ProgressSteps";

export default {
  title: "Navigation/Stepper/SidePanel",
  component: ProgressSteps,
  argTypes: {
    activeIndex: {
      control: { type: "number" },
    },
    errored: {
      control: { type: "boolean" },
    },
  },
};

export const Component = (args: Props): JSX.Element => <ProgressSteps {...args} />;
Component.args = {
  steps: ["Crypto Asset", "Device", "Accounts", "Confirmation"],
  activeIndex: 1,
  errored: false,
};
