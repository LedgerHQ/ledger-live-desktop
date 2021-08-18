import React, { useState } from "react";
import styled from "styled-components";
import { border, BorderProps } from "styled-system";
import Flex from "@components/Layout/Flex";

export type Props = React.PropsWithChildren<{
  /**
   * The tab index to mark as active when rendering for the first time.
   * If omitted, then initially no tabs will be selected.
   */
  initialActiveIndex?: number;
}>;
type ItemProps = {
  active: boolean;
};

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
  ${border};
`;
const Item = styled(Flex).attrs({ flex: 1, justifyContent: "center", alignItems: "center" })<
  ItemProps
>`
  cursor: pointer;
  padding: 8px;
  color: ${p =>
    p.active ? p.theme.colors.palette.v2.text.contrast : p.theme.colors.palette.v2.text.secondary};
  background-color: ${p =>
    p.active
      ? p.theme.colors.palette.v2.text.default
      : p.theme.colors.palette.v2.background.default};
  border: 1px solid
    ${p =>
      p.active ? p.theme.colors.palette.v2.text.default : p.theme.colors.palette.v2.grey.border};
`;

export default function PillTabs({ children, initialActiveIndex }: Props): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  return (
    <Pill>
      {React.Children.toArray(children).map((child, index) => (
        <Item key={index} active={index === activeIndex} onClick={_ => setActiveIndex(index)}>
          {child}
        </Item>
      ))}
    </Pill>
  );
}
