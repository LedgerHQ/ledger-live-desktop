import React from "react";
import Onboarding from "./index";
import type { OnboardingProps } from "./Onboarding";

export default {
  title: "Navigation/Onboarding",
  component: Onboarding,
  argTypes: {
    steps: { control: false },
    currentIndex: {
      type: "number",
      description: "currentIndex",
      required: true,
      control: {
        type: "number",
        min: 0,
        max: 4,
      },
    },
  },
};

const Template = (args: OnboardingProps) => {
  return <Onboarding steps={args.steps} currentIndex={args.currentIndex} />;
};

export const Default = Template.bind({});

Default.args = {
  steps: [
    {
      key: "getStarted",
      label: "get started",
    },
    {
      key: "genuineCheck",
      label: "genuine check",
    },
    {
      key: "recoveryPhrase",
      label: "recovery phrase",
    },
    {
      key: "hideRecovery",
      label: "hide recovery phrase",
    },
    {
      key: "connect",
      label: "connect nano",
    },
  ],
  currentIndex: 0,
};
