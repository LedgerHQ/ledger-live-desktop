// @flow
import React from "react";
import { components, GroupBase, ControlProps, ValueContainerProps } from "react-select";
import { useTheme } from "styled-components";
import SelectInput, {
  Props as SelectInputProps,
} from "@ledgerhq/react-ui/components/form/SelectInput";
import Text from "@ledgerhq/react-ui/components/asorted/Text";
import { ValueContainer } from "@ledgerhq/react-ui/components/form/SelectInput/ValueContainer";
import { ChevronBottomMedium, ChevronTopMedium } from "@ledgerhq/icons-ui/react";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";

export type Props<O> = SelectInputProps<O, false, GroupBase<O>> & {
  searchable?: boolean;
};

function DropdownControl<O, M extends boolean, G extends GroupBase<O>>(
  props: ControlProps<O, M, G>,
) {
  const { children } = props;

  return (
    <components.Control {...props}>
      <Text fontWeight="semiBold" p="0" variant={"paragraph"} color="neutral.c80">
        {children}
      </Text>
    </components.Control>
  );
}

function DropdownValueContainer<O>(props: ValueContainerProps<O, false>) {
  const ChevronIcon = props.selectProps.menuIsOpen ? ChevronTopMedium : ChevronBottomMedium;
  const { label } = (props.selectProps as unknown) as Props<O>;

  return (
    <ValueContainer
      {...props}
      render={() => (
        <FlexBox alignItems="center" flexDirection="row">
          <Text fontWeight="semiBold" variant={"paragraph"} color="neutral.c80" mr={2}>
            {label}
          </Text>
          <Text fontWeight="semiBold" variant={"paragraph"} mr={2}>
            <FlexBox>{props.children}</FlexBox>
          </Text>
          <FlexBox alignItems="center">
            <ChevronIcon size={12} />
          </FlexBox>
        </FlexBox>
      )}
    />
  );
}

function DropdownIndicatorsContainer() {
  return null;
}

export default function Dropdown<O>(props: Props<O>): JSX.Element {
  const theme = useTheme();

  return (
    <SelectInput
      placeholder=""
      isSearchable={props.searchable}
      styles={{
        singleValue: provided => ({
          ...provided,
          color: theme.colors.neutral.c100,
          margin: 0,
          top: undefined,
          position: undefined,
          overflow: undefined,
          maxWidth: undefined,
          transform: undefined,
          lineHeight: "32px",
        }),
        menu: provided => ({
          ...provided,
          border: 0,
          boxShadow: "none",
          background: "none",
          width: "max-content",
          minWidth: "100px",
          margin: 0,
          padding: 0,
          right: 0,
        }),
        control: () => ({
          padding: 0,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }),
      }}
      {...props}
      components={{
        Control: DropdownControl,
        ValueContainer: DropdownValueContainer,
        IndicatorsContainer: DropdownIndicatorsContainer,
      }}
    />
  );
}
