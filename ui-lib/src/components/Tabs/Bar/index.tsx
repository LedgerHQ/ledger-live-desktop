import React, { useState } from "react";
import styled from "styled-components";
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

const Bar = styled.div`
  display: inline-flex;
  border: 1px solid ${p => p.theme.colors.palette.v2.grey.border};
  border-radius: 33px;
  padding: 3px;
`;

const Item = styled(Flex).attrs({ flex: 1, justifyContent: "center", alignItems: "center" })<
  ItemProps
>`
  cursor: pointer;
  padding: 8px 12px 8px 12px;
  border-radius: 33px;
  color: ${p =>
    p.active ? p.theme.colors.palette.v2.text.contrast : p.theme.colors.palette.v2.text.secondary};
  background-color: ${p =>
    p.active
      ? p.theme.colors.palette.v2.text.default
      : p.theme.colors.palette.v2.background.default};
`;

export default function BarTabs({ children, initialActiveIndex }: Props): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  return (
    <Bar>
      {React.Children.toArray(children).map((child, index) => (
        <Item key={index} active={index === activeIndex} onClick={_ => setActiveIndex(index)}>
          {child}
        </Item>
      ))}
    </Bar>
  );
}
