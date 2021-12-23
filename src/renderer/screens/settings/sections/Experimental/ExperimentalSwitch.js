// @flow

import React, { useState, useCallback } from "react";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";

type Props = {
  name: string,
  valueOn: mixed,
  valueOff: mixed,
  isDefault: boolean,
  readOnly: boolean,
  onChange: (name: string, val: mixed) => boolean,
};

const ExperimentalSwitch = ({
  onChange,
  valueOn = true,
  valueOff = false,
  name,
  isDefault,
  readOnly,
}: Props) => {
  const [checked, setChecked] = useState(!isDefault);

  const handleOnChange = useCallback(
    (evt: boolean) => {
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
        onChange={readOnly ? null : handleOnChange}
        data-test-id={`${name}-button`}
      />
    </>
  );
};

export default ExperimentalSwitch;
