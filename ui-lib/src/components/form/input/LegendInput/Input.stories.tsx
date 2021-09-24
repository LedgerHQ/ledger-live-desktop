import React from "react";
import LegendInput from "./index";
import { InputProps } from "../BaseInput";

export default {
  title: "Form/Input/LegendInput",
  argTypes: {
    disabled: {
      type: "boolean",
      defaultValue: false,
    },
    error: {
      type: "string",
      defaultValue: undefined,
    },
    legend: {
      type: "string",
      defaultValue: "#Legend",
    },
  },
};

export const LegendInputDefault = (args: InputProps): JSX.Element => {
  const [value, setValue] = React.useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => setValue(e.target.value);

  return <LegendInput {...args} value={value} onChange={onChange} placeholder={"Placeholder"} />;
};
