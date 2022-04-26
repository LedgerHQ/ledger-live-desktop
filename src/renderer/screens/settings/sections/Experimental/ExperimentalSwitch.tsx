import React, { useState, useCallback } from "react";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";

type Props<T> = {
  name: string;
  valueOn: T;
  valueOff: T;
  isDefault: boolean;
  readOnly: boolean;
  onChange: (name: string, val: T) => void;
};

const ExperimentalSwitch = <T extends unknown>({
  onChange,
  valueOn,
  valueOff,
  name,
  isDefault,
  readOnly,
}: Props<T>) => {
  const [checked, setChecked] = useState(!isDefault);

  const handleOnChange = useCallback(
    (evt: boolean) => {
      if (readOnly) return;

      onChange(name, evt ? valueOn : valueOff);
      setChecked(evt);
    },
    [onChange, valueOn, valueOff, name, setChecked],
  );

  return (
    <>
      <Track onUpdate event={checked ? `${name}Enabled` : `${name}Disabled`} />
      <Switch
        disabled={readOnly}
        isChecked={checked}
        onChange={handleOnChange}
        name={`${name}_button`}
      />
    </>
  );
};

export default ExperimentalSwitch;
