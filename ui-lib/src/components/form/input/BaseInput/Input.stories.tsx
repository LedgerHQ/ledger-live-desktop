import React, { useState } from "react";
import Button from "@ui/components/cta/Button";
import Input, { InputProps, InputRenderLeftContainer, InputRenderRightContainer } from "./index";

export default {
  title: "Form/Input",
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

export const Default = (args: InputProps): JSX.Element => {
  const [value, setValue] = React.useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => setValue(e.target.value);

  return <Input {...args} value={value} onChange={onChange} placeholder={"Placeholder"} />;
};

export const RenderSideExemple = (): JSX.Element => {
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = React.useState(false);
  const [value, setValue] = React.useState("test@ledger.fr");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => setValue(e.target.value);

  const renderLeft = (
    <InputRenderLeftContainer>
      <Button type={"secondary"} onClick={() => setDisabled(!disabled)}>
        disable
      </Button>
    </InputRenderLeftContainer>
  );
  const renderRight = (props) => {
    return (
      <InputRenderRightContainer>
        <Button
          type={"secondary"}
          onClick={() => setError(error ? "" : "Error message")}
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          disabled={props.disabled}
        >
          error
        </Button>
      </InputRenderRightContainer>
    );
  };

  return (
    <Input
      value={value}
      disabled={disabled}
      error={error}
      onChange={onChange}
      renderLeft={renderLeft}
      renderRight={renderRight}
      placeholder={"test"}
    />
  );
};
