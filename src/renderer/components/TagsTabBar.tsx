import React from "react";
import { Tag, Text } from "@ledgerhq/react-ui";
import { Flex } from "@ledgerhq/react-ui/components/layout";

type Props = {
  onSelectedChanged: (index: number) => any;
  selectedIndex: number;
  tabs: string[];
};

const TagsTabBar = (props: Props) => {
  const { onSelectedChanged, selectedIndex, tabs } = props;
  return (
    <Flex flexDirection="row">
      {tabs.map((tab, index) => {
        const isSelected = index === selectedIndex;
        const color = isSelected ? "palette.neutral.c100" : "palette.neutral.c80";
        return (
          <Tag
            type="opacity"
            key={index}
            onClick={() => onSelectedChanged(index)}
            active={isSelected}
            style={{ marginLeft: index === 0 ? 0 : "8px" }}
          >
            <Text type="small" color={color}>
              {tab}
            </Text>
          </Tag>
        );
      })}
    </Flex>
  );
};

export default TagsTabBar;
