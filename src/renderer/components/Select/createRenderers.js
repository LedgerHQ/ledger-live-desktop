// @flow

import React from "react";
import styled from "styled-components";
import { components } from "react-select";
import Box from "~/renderer/components/Box";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconCross from "~/renderer/icons/Cross";
import { useTranslation } from "react-i18next";
import type { Option } from ".";
import SearchIcon from "~/renderer/icons/Search";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type OptionProps = *;

const InputWrapper: ThemedComponent<{}> = styled(Box)`
  & input::placeholder {
    color: ${p => p.theme.colors.palette.text.shade30};
  }
`;
export default ({
  renderOption,
  renderValue,
}: {
  renderOption: Option => Node,
  renderValue: Option => Node,
}) => ({
  ...STYLES_OVERRIDE,
  Option: function Option(props: OptionProps) {
    const { data, isSelected } = props;
    return (
      <components.Option {...props}>
        <Box horizontal pr={4} relative>
          <Box grow style={{ flex: 1 }}>
            {renderOption ? renderOption(props) : data.label}
          </Box>
          {isSelected && (
            <CheckContainer color="wallet">
              <IconCheck size={12} color={props.theme.colors.wallet} />
            </CheckContainer>
          )}
        </Box>
      </components.Option>
    );
  },
  SingleValue: function SingleValue(props: OptionProps) {
    const { data, selectProps } = props;
    const { isSearchable, menuIsOpen } = selectProps;
    return menuIsOpen && isSearchable ? null : (
      <components.SingleValue {...props}>
        {renderValue ? renderValue(props) : data.label}
      </components.SingleValue>
    );
  },
});

const STYLES_OVERRIDE = {
  DropdownIndicator: function DropdownIndicator(props: OptionProps) {
    return (
      <components.DropdownIndicator {...props}>
        <IconAngleDown size={20} color={props.isDisabled ? "transparent" : "currentcolor"} />
      </components.DropdownIndicator>
    );
  },
  ClearIndicator: function ClearIndicator(props: OptionProps) {
    return (
      <components.ClearIndicator {...props}>
        <IconCross size={16} />
      </components.ClearIndicator>
    );
  },
  Placeholder: function Input(props: OptionProps) {
    const { selectProps } = props;
    const { isSearchable, menuIsOpen } = selectProps;

    return menuIsOpen && isSearchable ? null : <components.Placeholder {...props} />;
  },
  Input: function Input(props: OptionProps) {
    const { t } = useTranslation();
    const { selectProps } = props;
    const { isSearchable, menuIsOpen } = selectProps;

    return menuIsOpen && isSearchable ? (
      <InputWrapper color={"palette.text.shade40"} alignItems="center" horizontal pr={3}>
        <SearchIcon size={16} />
        <components.Input
          {...props}
          style={{ marginLeft: 10 }}
          placeholder={t("common.searchWithoutEllipsis")}
        />
      </InputWrapper>
    ) : (
      <components.Input {...props} style={{ opacity: 0 }} />
    );
  },
};

const CheckContainer = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 10px;
`;
