import React, { SyntheticEvent, useState } from "react";

import Input from "~/renderer/components/Input";
import Button from "~/renderer/components/Button";

import { Icons } from "@ledgerhq/react-ui";

type Props = {
  onChange: (value: string) => void;
  value: string;
  error?: Error | string;
  onEnter?: () => void;
};

const InputPassword = ({ onChange, value, error, onEnter }: Props) => {
  const [inputType, setInputType] = useState<"text" | "password">("password");

  return (
    <Input
      type={inputType}
      error={error}
      value={value}
      onEnter={e => {
        e.preventDefault();
        if (onEnter) {
          onEnter();
        }
      }}
      onChange={onChange}
      renderRight={
        <Button
          onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setInputType(inputType === "text" ? "password" : "text");
          }}
          Icon={inputType === "text" ? Icons.EyeMedium : Icons.EyeNoneMedium}
        />
      }
    />
  );
};

export default InputPassword;
