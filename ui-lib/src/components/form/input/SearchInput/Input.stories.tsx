import React from "react";
import SearchInput from "./index";
import { InputProps } from "../BaseInput";

export default {
  title: "Form/Input/SearchInput",
  argTypes: {
    disabled: {
      type: "boolean",
      defaultValue: false,
    },
    error: {
      type: "string",
      defaultValue: undefined,
    },
  },
};

export const SearchInputDefault = (args: InputProps): JSX.Element => {
  const [value, setValue] = React.useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => setValue(e.target.value);

  return <SearchInput {...args} value={value} onChange={onChange} placeholder={"Placeholder"} />;
};
