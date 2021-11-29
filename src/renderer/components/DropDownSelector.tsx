import Tippy from "@tippyjs/react";
import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Flex } from "@ledgerhq/react-ui";

import { ThemedComponent } from "~/renderer/styles/StyleProvider";

const TippyContainer = styled.div`
  .tippy-box {
    background-color: white;
  }
`;

export const DropDownItem: ThemedComponent<{ isActive: boolean }> = styled(Flex).attrs(p => ({
  flexDirection: "row",
  alignItems: "center",
  px: 3,
  color: p.disabled
    ? "palette.neutral.c70"
    : p.isActive
    ? "palette.text.shade100"
    : "palette.text.shade60",
  bg: p.isActive && !p.disabled ? "palette.primary.c40" : "",
}))`
  height: 40px;
  white-space: nowrap;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: ${p => !p.disabled && p.theme.colors.palette.primary.c20};
  }
  border-radius: 4px;
`;

const DropContainer: ThemedComponent<{}> = styled.div`
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04);
  border: ${p => `1px solid ${p.theme.colors.palette.neutral.c40}`};
  background-color: ${p => p.theme.colors.palette.neutral.c00};
  max-height: 400px;
  max-width: 250px;
  ${p => p.theme.overflow.yAuto};
  border-radius: 8px;
  padding: 8px;

  > * {
    margin-bottom: 6px;
  }

  > :last-child {
    margin-bottom: 0px;
  }
`;

export type DropDownItemType = {
  key: string;
  label: any;
  disabled?: boolean;
};

const OptionContainer = styled.div`
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  cursor: pointer;
  flex-shrink: 1;
`;

type Props = {
  children: (props: { isOpen: boolean; value: DropDownItemType }) => React$Node;
  items: DropDownItemType[];
  onChange?: (value: any) => void;
  renderItem: (props: { isActive: boolean; item: any }) => React$Node | null;
  value?: DropDownItemType;
  controlled?: boolean;
  defaultValue?: DropDownItemType;
  buttonId?: string;
};

const DropDownSelector = ({
  children,
  items = [],
  onChange,
  renderItem,
  value,
  controlled = false,
  defaultValue = null,
  buttonId,
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
        <OptionContainer
          id={`${buttonId || ""}-${item.key}`}
          key={item.key}
          onClick={() => !item.disabled && setSelectedOption(item)}
        >
          {renderItem({ item, isActive: !!(selectedOption && item.key === selectedOption.key) })}
        </OptionContainer>
      );
    },
    [buttonId, renderItem, selectedOption, setSelectedOption],
  );

  return (
    <TippyContainer>
      <Tippy
        visible={isOpen}
        onClickOutside={!process.env.SPECTRON_RUN ? () => setOpen(false) : null}
        onShow={() => setOpen(true)}
        onHide={() => setOpen(false)}
        animation="shift-away"
        placement="bottom-start"
        interactive
        arrow={false}
        content={<DropContainer border>{items.map(renderOption)}</DropContainer>}
        theme="transparent"
      >
        <ButtonContainer id={buttonId} onClick={() => setOpen(!isOpen)}>
          {children({ isOpen, value: selectedOption })}
        </ButtonContainer>
      </Tippy>
    </TippyContainer>
  );
};

export default DropDownSelector;
