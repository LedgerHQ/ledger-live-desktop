import React from "react";
import { Checkbox } from "@ledgerhq/react-ui";
import type { CheckboxProps } from "@ledgerhq/react-ui/components/form/Checkbox/Checkbox"

export interface Props extends Omit<HTMLInputElement, "disabled">, CheckboxProps {
  isChecked: boolean;
  disabled?: boolean;
}

export default function CheckBox({ disabled, isChecked, ...checkboxProps }: Props) {
  return <Checkbox isDisabled={disabled} isChecked={isChecked} {...checkboxProps} />;
}
