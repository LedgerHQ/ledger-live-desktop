import React from "react";
import NumberInput from "./index";
import { InputProps } from "../BaseInput";

export default {
  title: "Form/Input/NumberInput",
  argTypes: {
    disabled: {
      type: "boolean",
      defaultValue: false,
    },
    error: {
      type: "string",
      defaultValue: undefined,
    },
    max: {
      type: "number",
      defaultValue: 349,
    },
    min: {
      type: "number",
      defaultValue: 0,
    },
  },
};

export const NumberInputDefault = ({
  min,
  max,
  ...otherArgs
}: InputProps & { max: number; min: number }): JSX.Element => {
  const [value, setValue] = React.useState(24.42);

  const onChange = (e) => {
    let value = e.target.value;
    if (value) {
      value = parseFloat(e.target.value);
      if (value > max) value = max;
      if (value < min) value = min;
    }
    setValue(value);
  };

  const onPercentClick = (percent) => {
    setValue(max * percent);
  };

  return (
    <NumberInput
      {...otherArgs}
      value={value}
      onChange={onChange}
      onPercentClick={onPercentClick}
      placeholder={"Placeholder"}
      price={"#Price"}
      max={max}
      min={min}
    />
  );
};
