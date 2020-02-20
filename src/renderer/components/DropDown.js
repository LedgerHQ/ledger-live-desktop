// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import Downshift from "downshift";

import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Trigger: ThemedComponent<{}> = styled(Box)`
  outline: none;
  cursor: pointer;
`;

const Drop: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  boxShadow: 0,
  borderRadius: 1,
  p: 2,
}))`
  border: ${p => (p.border ? `1px solid ${p.theme.colors.palette.divider}` : "none")};
  max-height: 400px;
  max-width: 250px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1;
  ${p => p.theme.overflow.yAuto};
`;

export const DropDownItem: ThemedComponent<{ isHighlighted: boolean, isActive: boolean }> = styled(
  Box,
).attrs(p => ({
  borderRadius: 1,
  justifyContent: "center",
  ff: p.isActive ? "Inter|SemiBold" : "Inter",
  fontSize: 4,
  px: 3,
  color: p.isHighlighted || p.isActive ? "palette.text.shade100" : "palette.text.shade80",
  bg: p.isActive ? "palette.background.default" : "",
}))`
  height: 40px;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background-color: ${p => p.theme.colors.palette.background.default};
  }
`;

export const Wrapper: ThemedComponent<{
  shrink?: string,
}> = styled(Box)`
  flex-shrink: 1;
  ${p => p.shrink && `flex-shrink:${p.shrink};`}
`;

function itemToString(item) {
  return item ? item.label : "";
}

export type DropDownItemType = {
  key: string,
  label: any,
};

type Props = {
  children: any,
  items: Array<DropDownItemType>,
  keepOpenOnChange?: boolean,
  offsetTop: number | string,
  offsetRight: number | string,
  border?: boolean,
  onChange?: (?DropDownItemType) => void,
  onStateChange?: Function,
  renderItem: Object => any,
  value?: DropDownItemType | null,
  shrink?: string,
  multiple: boolean,
};

class DropDown extends PureComponent<Props> {
  static defaultProps = {
    keepOpenOnChange: false,
    value: null,
    onChange: noop,
    onStateChange: noop,
    offsetTop: 1,
    offsetRight: 0,
    renderItem: ({
      item,
      isHighlighted,
      isActive,
    }: {
      item: DropDownItemType,
      isHighlighted: boolean,
      isActive: boolean,
    }) => (
      <DropDownItem isHighlighted={isHighlighted} isActive={isActive}>
        {item.label}
      </DropDownItem>
    ),
    multiple: false,
  };

  handleStateChange = (state: Object, changes: Object) => {
    const { keepOpenOnChange, multiple, onStateChange } = this.props;

    if (onStateChange) {
      onStateChange(changes);
    }

    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEscape:
      case Downshift.stateChangeTypes.mouseUp:
      case Downshift.stateChangeTypes.clickButton:
        return changes;

      case Downshift.stateChangeTypes.keyDownEnter:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
        };

      default:
        return {
          ...changes,
          ...(keepOpenOnChange || multiple
            ? {
                isOpen: true,
              }
            : {}),
        };
    }
  };

  renderItems = (
    items: Array<DropDownItemType>,
    selectedItem: ?DropDownItemType | Array<DropDownItemType>,
    multiple: boolean,
    downshiftProps: Object,
  ) => {
    const { offsetTop, offsetRight, renderItem, border } = this.props;
    const { getItemProps, highlightedIndex } = downshiftProps;

    return (
      <Drop mt={offsetTop} mr={offsetRight} border={border}>
        {items.map((item, i) => {
          const { key, ...props } = item;
          return (
            <Box mt={i > 0 ? 1 : 0} key={key} {...getItemProps({ item })} {...props}>
              {renderItem({
                item,
                isHighlighted: highlightedIndex === i,
                isActive:
                  multiple && Array.isArray(selectedItem)
                    ? selectedItem.includes(key)
                    : item === selectedItem,
              })}
            </Box>
          );
        })}
      </Drop>
    );
  };

  render() {
    const { children, items, value, onChange, shrink, multiple, ...props } = this.props;
    return (
      <Downshift
        onChange={onChange}
        stateReducer={this.handleStateChange}
        itemToString={itemToString}
        selectedItem={value}
      >
        {({
          getToggleButtonProps,
          getRootProps,
          isOpen,
          openMenu,
          selectedItem,
          ...downshiftProps
        }) => (
          <Wrapper
            {...getRootProps({ refKey: "ref" }, { suppressRefError: true })}
            shrink={shrink}
            horizontal
            relative
          >
            {/* $FlowFixMe */}
            <Trigger {...getToggleButtonProps()} {...props} tabIndex={0}>
              {children}
            </Trigger>
            {isOpen && this.renderItems(items, selectedItem, multiple, downshiftProps)}
          </Wrapper>
        )}
      </Downshift>
    );
  }
}

export default DropDown;
