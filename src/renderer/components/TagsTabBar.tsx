import React from "react";
import styled from "styled-components";
import { Tag, Text } from "@ledgerhq/react-ui";
import { Flex } from "@ledgerhq/react-ui/components/layout";

type Props = {
  onSelectedChanged: (index: number) => any;
  selectedIndex: number;
  tabs: string[];
};

const Tab = styled(Tag).attrs({
  type: "opacity",
})`
  cursor: pointer;
`;

const TagsTabBar = (props: Props) => {
  const { onSelectedChanged, selectedIndex, tabs } = props;
  return (
    <Flex flexDirection="row" columnGap={3}>
      {tabs.map((tab, index) => {
        const isSelected = index === selectedIndex;
        const color = isSelected ? "palette.neutral.c100" : "palette.neutral.c80";
        return (
          <Tab key={index} onClick={() => onSelectedChanged(index)} active={isSelected}>
            <Text variant="small" color={color}>
              {tab}
            </Text>
          </Tab>
        );
      })}
    </Flex>
  );
};

export default TagsTabBar;
