import React, { useCallback } from "react";
import styled, { useTheme } from "styled-components";
import { Flex, Text, DropdownGeneric } from "@ledgerhq/react-ui";
import { Props as DropdownProps } from "@ledgerhq/react-ui/components/form/DropdownGeneric";
import { useTranslation } from "react-i18next";
import CheckBox, { Props as CheckboxProps } from "./CheckBox";
import { noop } from "lodash";

// eslint-disable-next-line flowtype/no-types-missing-file-annotation
export type Option = {
  value: string;
  /** Label displayed next to the checkbox */
  label: string | React.ReactNode;
  /** Checked state of the checkbox */
  checked?: boolean;
};

// eslint-disable-next-line flowtype/no-types-missing-file-annotation
export type Props = {
  /**
   * Label displayed in the dropdown button, before the chevron
   * */
  label: string;
  /**
   * Options to display as a list of checkboxes
   */
  options: Option[];
  /**
   * Called when a checkbox is pressed, with the new state for all options
   * */
  onChange: (options: Option[]) => void;
  /**
   * Whether to show an "all" button.
   * Defaults to false.
   * */
  showAll?: boolean;
  /**
   * Called when pressing the "all" button (requires `showAll={true}`)
   * */
  onPressAll?: () => void;
  /**
   * Checked state of the "all" button (requires `showAll={true}`)
   * Defaults to false.
   * */
  isAllOn?: boolean;
  /**
   * Indeterminate state of the "all" button, if it's true and if `isAllOn`
   * the checkbox will contain a dash instead of a chec
   * (requires `showAll={true}`)
   * */
  isAllIndeterminate?: boolean;
} & Pick<DropdownProps, "placement">;

const CountPill = styled(Flex).attrs({
  height: "20px",
  width: "20px",
  borderRadius: "20px",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "primary.c80",
})``;

const CountPillText = styled(Text).attrs({
  variant: "small",
  fontWeight: "semiBold",
  fontSize: "12px",
  lineHeight: "15px",
  color: "neutral.c00",
})``;

const LabelText = styled(Text).attrs({
  variant: "paragraph",
  fontWeight: "medium",
  fontSize: "13px",
  lineHeight: "15.73px",
})``;

/* DO NOT REUSE, Temporary until we fully migrate to V3 and reuse Checkbox from the UI lib */
const CheckboxContainer = styled(Flex).attrs({
  height: "48px",
  flexDirection: "row",
  alignItems: "center",
  columnGap: "8px",
  borderRadius: "4px",
  px: "12px",
})`
  box-sizing: content-box;
  :hover {
    background-color: ${p => p.theme.colors.primary.c30};
  }
`;

export const CheckboxText = styled(Text).attrs({
  flexShrink: 0,
  variant: "paragraph",
  fontWeight: "semiBold",
  fontSize: "13px",
  lineHeight: "15.73px",
})`
  white-space: nowrap;
`;

/* DO NOT REUSE, Temporary until we fully migrate to V3 and reuse Checkbox from the UI lib */
const CheckboxWithLabel = ({
  isChecked,
  isIndeterminate,
  onChange,
  label,
  disabled,
}: CheckboxProps & { label: string | React.ReactNode }) => {
  const handleClick = useCallback(() => {
    !disabled && onChange && onChange(!isChecked);
  }, [disabled, onChange, isChecked]);
  return (
    <CheckboxContainer onClick={handleClick}>
      <CheckBox onChange={onChange} isChecked={isChecked} isIndeterminate={isIndeterminate} />
      {typeof label === "string" ? <CheckboxText>{label}</CheckboxText> : label}
    </CheckboxContainer>
  );
};

const DropdownPicker: React.FC<Props> = ({
  label,
  options,
  onChange,
  showAll = false,
  onPressAll,
  isAllOn = false,
  isAllIndeterminate,
  placement,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLight = theme.colors.type === "light";

  const handleChange = useCallback(
    (value, checked) => {
      const newOptions = options.map(opt => (opt.value === value ? { ...opt, checked } : opt));
      onChange(newOptions);
    },
    [options, onChange],
  );

  const optionsCheckedCount = options.filter(o => o.checked).length;
  const Label = (
    <Flex flexDirection="row" alignItems="center" columnGap="4px" marginRight="-10px">
      <LabelText color={isLight ? "neutral.c80" : "neutral.c60"}>{label}</LabelText>
      {optionsCheckedCount === options.length ? (
        <LabelText color="neutral.c100">{t("common.all")}</LabelText>
      ) : (
        <CountPill>
          <CountPillText>{optionsCheckedCount}</CountPillText>
        </CountPill>
      )}
    </Flex>
  );

  return (
    <DropdownGeneric label={Label} placement={placement || "bottom-end"}>
      <Flex flexDirection="column" maxHeight="300px" overflowY="auto">
        {showAll && (
          <CheckboxWithLabel
            onChange={onPressAll || noop}
            isChecked={isAllOn || false}
            isIndeterminate={isAllIndeterminate}
            label={t("common.all")}
          />
        )}
        {options.map(({ value, label, checked = false }) => {
          return (
            <CheckboxWithLabel
              key={value}
              label={label}
              onChange={(newChecked: boolean) => handleChange(value, newChecked)}
              isChecked={checked}
            />
          );
        })}
      </Flex>
    </DropdownGeneric>
  );
};

export default DropdownPicker;
