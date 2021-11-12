import React from "react";
import noop from "lodash/noop";
import { Switch as BaseSwitch } from "@ledgerhq/react-ui";
import type { SwitchProps } from "@ledgerhq/react-ui/components/form/Switch/Switch"

export interface Props extends Omit<SwitchProps, "onChange" | "checked"> {
  isChecked: boolean,
  small?: boolean,
  medium?: boolean,
  onChange?: (value: boolean) => void
}

export default function Switch({ isChecked, small, medium, onChange = noop, ...switchProps } : Props) {
  return <BaseSwitch {...switchProps} checked={isChecked} onChange={() => onChange(!isChecked) } size={small ? "small": "normal"} />;
}
