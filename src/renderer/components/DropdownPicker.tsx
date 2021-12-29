import React, { useCallback } from "react";
import styled from "styled-components";
import { Flex, Text, DropdownGeneric } from "@ledgerhq/react-ui";
import { Props as DropdownProps } from "@ledgerhq/react-ui/components/form/DropdownGeneric";
import { useTranslation } from "react-i18next";
import CheckBox, { Props as CheckboxProps } from "./CheckBox";

type AllCheckboxState = "checked" | "unchecked" | "minus";

export type Option = {
  value: string;
  label: string;
  checked: boolean;
};

export type Props = {
  label: string;
  options: Option[];
  onChange: (options: Option[]) => void;
  onPressAll: () => void;
  showAll?: boolean;
  isAllOn?: boolean;
  allBoxState?: AllCheckboxState;
} & Pick<DropdownProps, "placement">;

const CountPill = styled(Flex).attrs({
  height: "20px",
  width: "20px",
  borderRadius: "20px",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "primary.c60",
  color: "neutral.c100",
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
  flex: 1,
  borderRadius: "4px",
  px: "12px",
})`
  :hover {
    background-color: ${p => p.theme.colors.primary.c30};
  }
`;

/* DO NOT REUSE, Temporary until we fully migrate to V3 and reuse Checkbox from the UI lib */
const CheckboxWithLabel = ({
  isChecked,
  onChange,
  label,
  disabled,
}: CheckboxProps & { label: string }) => {
  const handleClick = useCallback(() => {
    !disabled && onChange && onChange(!isChecked);
  }, [disabled, onChange, isChecked]);
  return (
    <Flex flex={1}>
      <CheckboxContainer onClick={handleClick}>
        <CheckBox onChange={onChange} isChecked={isChecked} />
        <Text variant="paragraph" fontWeight="semiBold" fontSize="13px" lineHeight="15.73px">
          {label}
        </Text>
      </CheckboxContainer>
    </Flex>
  );
};

const DropdownPicker: React.FC<Props> = ({
  label,
  options,
  onChange,
  showAll = true,
  onPressAll,
  isAllOn,
  placement,
}: Props) => {
  const { t } = useTranslation();

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
      <LabelText color="neutral.c80">{label}</LabelText>
      {optionsCheckedCount === options.length ? (
        <LabelText color="neutral.c100">{t("common.all")}</LabelText>
      ) : optionsCheckedCount === 1 ? (
        <LabelText color="neutral.c100">{options.find(opt => opt.checked)?.label}</LabelText>
      ) : (
        <CountPill>
          <Text variant="small" fontWeight="semiBold" fontSize="12px" lineHeight="15px">
            {optionsCheckedCount}
          </Text>
        </CountPill>
      )}
    </Flex>
  );

  return (
    <DropdownGeneric label={Label} placement={placement || "bottom-end"}>
      <Flex flexDirection="row" maxHeight="300px">
        <Flex flexDirection="column" flex={1}>
          {showAll && (
            <CheckboxWithLabel
              onChange={onPressAll}
              isChecked={isAllOn || false}
              label={t("common.all")}
            />
          )}
          {options.map(({ value, label, checked }) => {
            return (
              <CheckboxWithLabel
                key={value}
                label={label}
                onChange={newChecked => handleChange(value, newChecked)}
                isChecked={checked}
              />
            );
          })}
        </Flex>
      </Flex>
    </DropdownGeneric>
  );
};

export default DropdownPicker;
