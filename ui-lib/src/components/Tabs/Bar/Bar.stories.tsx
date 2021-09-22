import React, { useState } from "react";
import BarTabs, { Props } from "@components/Tabs/Bar";
import Text from "@components/Text";

export default {
  title: "Tabs/Graph",
  component: BarTabs,
  argTypes: {
    initialActiveIndex: {
      control: { type: "number" },
    },
  },
};

const navItems = ["One", "Two", "Three", "Four", "Five"];

function Sample({ children, ...args }: Props) {
  const [activeIndex, setActiveIndex] = useState(args.initialActiveIndex);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ width: "100px" }}>
        <BarTabs {...args} onTabChange={setActiveIndex}>
          {children}
        </BarTabs>
      </div>
      <Text type="subTitle">Active index: {activeIndex}</Text>
      <hr />
    </div>
  );
}

export const Graph = (args: Props): React.ReactNode[] =>
  navItems.reduce<React.ReactNode[]>((acc, _, index) => {
    const labels = [
      navItems.slice(0, index + 1).map((label) => (
        <Text color="inherit" type="navigation">
          {label}
        </Text>
      )),
    ];
    return [
      ...acc,
      <Sample {...args} key={index}>
        {labels}
      </Sample>,
    ];
  }, []);

Graph.args = {
  initialActiveIndex: 1,
};
