import React, { useState } from "react";
import styled from "styled-components";
import { border, BorderProps } from "styled-system";
import Flex from "@components/Layout/Flex";

export type Props = React.PropsWithChildren<{
  /**
   * An optional callback that will be called when the active tab changes.
   */
  onTabChange?: (activeIndex: number) => void;
  /**
   * The tab index to mark as active when rendering for the first time.
   * If omitted, then initially no tabs will be selected.
   */
  initialActiveIndex?: number;
}>;

const Pill = styled.div<BorderProps>`
  display: inline-flex;
  & > :first-child {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    padding-left: 12px;
  }
  & > :last-child {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    padding-right: 12px;
  }
  & > :not(:first-child) {
    border-left-width: 0;
  }
  ${border};
`;
const Item = styled(Flex).attrs({ flex: 1, justifyContent: "center", alignItems: "center" })`
  cursor: pointer;
  padding: 8px 10px 8px 10px;
  border: 1px solid;
  &[data-active="false"] {
    color: ${(p) => p.theme.colors.palette.neutral.c80};
    background-color: ${(p) => p.theme.colors.palette.neutral.c00};
    border-color: ${(p) => p.theme.colors.palette.neutral.c90};
  }
  &[data-active="true"] {
    color: ${(p) => p.theme.colors.palette.neutral.c00};
    background-color: ${(p) => p.theme.colors.palette.neutral.c100};
    border-color: ${(p) => p.theme.colors.palette.neutral.c100};

    &:not(:last-child) {
      border-right-width: 0;
    }
  }
  &[data-active="true"] + div {
    border-left-width: 1px;
  }
`;

export default function PillTabs({
  children,
  onTabChange,
  initialActiveIndex,
}: Props): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  return (
    <Pill>
      {React.Children.toArray(children).map((child, index) => (
        <Item
          key={index}
          data-active={index === activeIndex}
          onClick={(_) => {
            setActiveIndex(index);
            onTabChange && onTabChange(index);
          }}
        >
          {child}
        </Item>
      ))}
    </Pill>
  );
}
