// @flow

import React from "react";
import styled from "styled-components";
import { components } from "react-select";
import Box from "~/renderer/components/Box";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconCross from "~/renderer/icons/Cross";
import type { Option } from ".";

type OptionProps = *;

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
    const { data } = props;
    return (
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
        <div style={{ color: props.isDisabled ? "transparent" : "inherit" }}>
          <IconAngleDown size={20} />
        </div>
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
