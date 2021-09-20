import React from "react";
import Switch from "./index";
import type { SwitchProps } from "./Switch";
import { useArgs } from "@storybook/client-api";

export default {
  title: "Form/Switch",
  component: Switch,
  argTypes: {
    name: { control: false },
    onChange: { control: false },
    checked: {
      type: "boolean",
      description: "Control if the component is checked or not",
      required: true,
      control: { type: "boolean" },
    },
    label: {
      type: "text",
      description: "Any valid string",
      required: false,
      control: { type: "text" },
    },
    disabled: {
      type: "boolean",
      description: "Control if the component is disabled or not",
      required: false,
      control: { type: "boolean" },
    },
    reversed: {
      type: "boolean",
      description: "Control if the component is disabled or not",
      required: false,
      control: { type: "boolean" },
    },
    size: {
      options: ["normal", "small"],
      control: { type: "select" },
    },
  },
};

const Template = (args: SwitchProps) => {
  const [currentArgs, updateArgs] = useArgs();

  const handleChange = () => updateArgs({ checked: !currentArgs.checked });

  return <Switch {...args} onChange={handleChange} />;
};

export const Default = Template.bind({});
export const Reversed = Template.bind({});

Default.args = {
  checked: false,
  label: "Switch with label",
  name: "default Switch",
  size: "normal",
};

Reversed.args = {
  checked: false,
  label: "Reversed Switch with label",
  name: "success Switch",
  reversed: true,
  size: "normal",
};
