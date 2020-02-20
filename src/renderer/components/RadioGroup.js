// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  height: 34px;

  > * + * {
    border-left: 0 !important;
  }

  *:first-child {
    border-top-left-radius: ${p => p.theme.radii[1]}px;
    border-bottom-left-radius: ${p => p.theme.radii[1]}px;
  }

  *:last-child {
    border-top-right-radius: ${p => p.theme.radii[1]}px;
    border-bottom-right-radius: ${p => p.theme.radii[1]}px;
  }
`;

const Btn = styled(Box).attrs(p => ({
  color: p.isActive ? "palette.primary.contrastText" : "palette.text.shade60",
  bg: p.isActive ? "palette.primary.main" : "palette.background.paper",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 3,
  ff: "Inter|SemiBold",
  px: 3,
}))`
  cursor: pointer;
  border: solid 1px ${p => (p.isActive ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
  margin-left: ${p => (p.isActive ? -1 : 0)}px;
`;

type Item = {
  label: React$Node,
  key: string,
};

type Props = {
  items: Array<Item>,
  activeKey: string,
  onChange: Item => void,
};

function RadioGroup(props: Props) {
  const { items, activeKey, onChange, ...p } = props;
  return (
    <Container {...p}>
      {items.map(item => {
        const isActive = item.key === activeKey;
        return (
          <Btn key={item.key} onClick={() => onChange(item)} isActive={isActive}>
            {item.label}
          </Btn>
        );
      })}
    </Container>
  );
}

export default RadioGroup;
