// @flow

import Tippy from "@tippyjs/react";
import React, { useState, useCallback } from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

export const DropDownItem: ThemedComponent<{ isActive: boolean }> = styled(Box).attrs(p => ({
  borderRadius: 1,
  justifyContent: "center",
  ff: p.isActive ? "Inter|SemiBold" : "Inter",
  fontSize: 4,
  px: 3,
  color: p.isActive ? "palette.text.shade100" : "palette.text.shade80",
  bg: p.isActive ? "palette.background.default" : "",
}))`
  height: 40px;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background-color: ${p => p.theme.colors.palette.background.default};
  }
`;

const DropContainer: ThemedComponent<{}> = styled.div`
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  border: ${p => `1px solid ${p.theme.colors.palette.divider}`};
  max-height: 400px;
  max-width: 250px;
  ${p => p.theme.overflow.yAuto};
  border-radius: 6px;
  background-color: ${p => p.theme.colors.palette.background.paper};
  padding: 8px;

  > * {
    margin-bottom: 6px;
  }

  > :last-child {
    margin-bottom: 0px;
  }
`;

export type DropDownItemType = {
  key: string,
  label: any,
};

const OptionContainer = styled.div`
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  cursor: pointer;
`;

type Props = {
  children: (props: { isOpen: ?boolean, value: ?DropDownItemType }) => React$Node,
  items: DropDownItemType[],
  onChange?: (value: any) => void,
  renderItem: (props: { isActive: boolean, item: any }) => React$Node | null,
  value?: ?DropDownItemType,
  controlled?: boolean,
  defaultValue?: ?DropDownItemType,
};

const DropDownSelector = ({
  children,
  items = [],
  onChange,
  renderItem,
  value,
  controlled = false,
  defaultValue = null,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [stateValue, setStateValue] = useState(defaultValue);

  const selectedOption = controlled ? value : stateValue;

  const setSelectedOption = useCallback(
    item => {
      if (controlled) {
        setStateValue(item);
      }
      if (onChange) {
        onChange(item);
      }
      setOpen(false);
    },
    [controlled, onChange],
  );

  const renderOption = useCallback(
    item => {
      return (
        <OptionContainer key={item.key} onClick={() => setSelectedOption(item)}>
          {renderItem({ item, isActive: !!(selectedOption && item.key === selectedOption.key) })}
        </OptionContainer>
      );
    },
    [renderItem, selectedOption, setSelectedOption],
  );

  return (
    <div>
      <Tippy
        visible={isOpen}
        onClickOutside={() => setOpen(false)}
        onShow={() => setOpen(true)}
        onHide={() => setOpen(false)}
        animation="shift-away"
        placement="bottom-start"
        interactive
        arrow={false}
        content={<DropContainer border>{items.map(renderOption)}</DropContainer>}
      >
        <ButtonContainer onClick={() => setOpen(!isOpen)}>
          {children({ isOpen, value: selectedOption })}
        </ButtonContainer>
      </Tippy>
    </div>
  );
};

export default DropDownSelector;
