import React, { useCallback, useState, useEffect } from "react";
import { getEnvDefault } from "@ledgerhq/live-common/lib/env";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";
import Input from "~/renderer/components/Input";
import Box from "~/renderer/components/Box";

type Props = {
  name: string,
  isDefault: boolean,
  readOnly: boolean,
  onChange: (name: string, val: string) => boolean,
  value: string,
  placeholder: string,
  regexFormat?: string,
};

export const ExperimentalString = ({
  name,
  isDefault,
  readOnly,
  onChange,
  value,
  placeholder,
  regexFormat,
}: Props): JSX.Element => {

  const formatValue = useCallback(
    v => {
      if (!v) {
        return "";
      }

      if (!regexFormat) {
        return v;
      }

      const formatedResult = v.match(regexFormat);
      return !!formatedResult ? formatedResult[0] : '';
    },
    [regexFormat],
  );

  const [enabled, setEnabled] = useState(!isDefault);
  const [inputValue, setInputValue] = useState(String(formatValue(value)));
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // TODO: what does it do ?
    if (isDefault && !enabled) {
      if (value.length === 0) {
        value = getEnvDefault(name);
      }
      setInputValue(formatValue(value));
    }
  }, [isDefault, enabled, value, setInputValue, formatValue]);

  const onInputChange = useCallback(
    inputValue => {
      if (!enabled) return;
      // FIXME: not here
      const formatedValue = formatValue(inputValue);
      if (formatedValue.length > 0) {
        // FIXME: call onChange only on correct formated result ?
        // And turn the input to green ?
        setIsValid(true);
        onChange(name, formatedValue);
      } else {
        setIsValid(false);
      }

      setInputValue(inputValue);
    },
    [name, onChange, formatValue, enabled],
  );

  const onSwitchChange = useCallback(
    e => {
      setEnabled(!!e);
      if (e) {
        // Sets the value to current input value when enabled
        onChange(name, formatValue(inputValue));
      } else {
        onChange(name, '');
      }
    },
    [setEnabled, name, onChange, value, formatValue],
  );

  return (
    <div>
      <Track onUpdate event={enabled ? `${name}Enabled` : `${name}Disabled`} />

      <Box grow horizontal flow={2} alignItems="center">
        {enabled ? (
          <Input
            style={{ maxWidth: 300 }}
            disabled={!enabled}
            value={enabled ? inputValue : ""}
            onChange={onInputChange}
            placeholder={placeholder}
            error={!isValid}
          />
        ) : null}

        <Box style={{ width: 100 }} />

        <Switch
          disabled={readOnly}
          isChecked={enabled}
          onChange={onSwitchChange}
        />
      </Box>
    </div>
  );
};
